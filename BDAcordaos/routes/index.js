var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const Email = require('email-templates');

var User = require('../models/user');
var acordaos = require('../controllers/acordaos');
var courts = require('../controllers/courts');
var updates = require('../controllers/updates');
var requests = require('../controllers/requests');

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3a473fd02988e9",
    pass: "7ca01a7ac76a99"
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  var data = new Date().toISOString().substring(0,16)
  if(req.user)
    res.render('index', {d: data, u: req.user});
  else
    res.render('index', {d: data});
});


/* GET personal menu page. */
router.get('/personal-menu', function(req, res, next) {
  var data = new Date().toISOString().substring(0,16)
  if(req.user)
    res.render('personal-menu', {d: data, u: req.user});
  else
    res.render('personal-menu', {d: data});
});


/* Method to verify if user is authenticated */
function verificaAutenticacao(req, res, next){
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
    res.redirect("/users/login");
  }
}


/* GET protected page. */
router.get('/protegida', verificaAutenticacao, (req,res) => {
  var data = new Date().toISOString().substring(0,16)
  res.render('protected', {d: data, u: req.user})
});


/*GET favorites page. */
router.get('/favorites', verificaAutenticacao, async function(req, res, next) {
  var data = new Date().toISOString().substring(0,16)
  try {
    const favorites = await User.getFavorites(req.user._id);
    var acordaosList = [];
    for (var i = 0; i < favorites.length; i++) {
      var acordao = await acordaos.findByID(favorites[i].acordaoId);
      acordao.title = favorites[i].title;
      if(acordao) acordaosList.push(acordao);
    }
    courts.list().then(dados => {
      res.render('favorites', {d: data, u: req.user, results: acordaosList, courts: dados });
    });
  } catch(err) {
    res.status(520).render('notFound', { message: 'Error processing your request.\n' + err });
  }
});


/* GET search page. */
router.get('/search', verificaAutenticacao, function(req, res, next) {
  const fields = ['Nº Convencional', 'Nº do Documento', 'Processo', 'Acordão', 'Nº Processo/TAF', 'Relator', 'Descritores', 'Data',
    'Data do Acordão', 'Data da Decisão', 'Data de Entrada', 'Espécie', 'Requerente', 'Requerido', 'Recorrente', 'Recorrido 1', 'Recorrido 2',
    'Votação', 'Privacidade', 'Normas Apreciadas', 'Normas Julgadas Inconst.', 'Contecioso', 'Peça Processual', 'Área Temática 1',
    'Área Temática 2', 'Normas Suscitadas', 'Nº do Diário da República', 'Data do Diário da República', 'Página do Diário da República',
    'Legislação Nacional', 'Secção', 'Sub-secção', 'Juízo ou Secção', 'Tipo de Ação', 'Tipo de Contrato', 'Autor', 'Decisão', 'Sumário',
    'Decisão Texto Integral', 'Texto Integral', 'Texto das Cláusulas Abusivas', 'Tema', 'Recursos', 'Meio Processual', 'Tribunal', 'Réu',
    'url', 'tribunal'
  ];
  courts.list().then(dados => {
    res.render('search', { fields: fields, courts: JSON.stringify(dados), u: req.user});
  }).catch(err => {
    res.status(520).render('notFound', { message: 'Error processing your request.\n' + err });
  });
});


/* GET search results. */
router.get('/search/results', verificaAutenticacao, async function(req, res, next) {
  try {
    const fields = {};
    const field = req.query.field;
    const value = req.query.value;
    if (typeof field != 'string') {
      field.forEach((f, i) => {
        fields[f] = value[i];
      });
    }
    else {
      fields[field] = value;
    }
    const requestId = await requests.add(req.user._id, JSON.stringify(fields));
    const link = '/requests/' + requestId;
    res.render('searchInProgress', { link: link, u: req.user });
    acordaos.findByFields(fields).then(dados => {
      requests.conclude(requestId, dados)
        .then(async () => {
          const user = await User.findById(req.user._id);
          const email = user.email;
          if (!email) return;
            const mail = new Email({
              message: {
                from: 'results@rpcw.com'
              },
              send: true,
              transport: transport
            });
            mail.send({
                message: {
                  to: email,
                  subject: 'Resultados da pesquisa',
                  html: '<p>Os resultados da sua pesquisa estão prontos. Pode aceder a eles através do seguinte link: <a href="http://localhost:7024/requests/' + requestId + '">Aqui</a></p>'
                },
              })
        })
    }).catch(err => {
      res.status(520).render('notFound', { message: 'Error processing your request.\n' + err });
    });
  } catch(err) {
    res.status(520).render('notFound', { message: 'Error processing your request.\n' + err });
  }
});


/* GET user requests. */
router.get('/requests', verificaAutenticacao, async function(req, res, next) {
  try {
    const reqs = await requests.getByUser(req.user._id);
    res.render('requests', { requests: reqs, u: req.user });
  } catch(err) {
    res.status(520).render('notFound', { message: 'Error processing your request.\n' + err });
  }
});


/* GET search results page. */
router.get('/requests/:id', verificaAutenticacao, async function(req, res, next) {
  try {
    const dados = await requests.getById(req.params.id);
    courts.list().then(cts => {
      res.render('searchResults', { id: req.params.id, search: dados.search, date: dados.dateRequested, concluded: dados.dateRequested, expireAt: dados.expireAt, courts: cts, u: req.user });
    });
  } catch(err) {
    res.status(520).render('notFound', { message: 'Error processing your request.\n' + err });
  }
});


/* GET search results data. */
router.get('/requests/data/:id', verificaAutenticacao, async function(req, res, next) {
  try {
    const start = Number(req.query.start) || 0;
    const length = Number(req.query.length) || 10;
    const page = Math.floor(start / length) + 1;
    const results = await requests.getResults(req.params.id, length, page);
    const data = results.data;
    const recordsTotal = results.total;
    var acords = await Promise.all(data.map(async (d) => {
      const acordao = await acordaos.findByID(d._id);
      return acordao;
    }));
    const result = {
      draw: req.query.draw,
      recordsTotal: recordsTotal,
      recordsFiltered: recordsTotal,
      data: acords
    };
    res.json(result);
  } catch(err) {
    console.log(err);
    res.status(520).render('notFound', { message: 'Error processing your request.\n' + err });
  }
});


/* GET all acordaos. */
router.get('/acordaos', function(req, res) {
  try {
    courts.list().then(dados => {
      res.render('acordaos', { courts: dados, u: req.user });
    });
  } catch(erro) {
    res.status(520).render('notFound', { message: 'Error processing your request.\n' + erro });
  }
});


/* GET all acordaos data. */
router.get('/acordaos/data', async function(req, res) {
  try {
    const start = Number(req.query.start) || 0;
    const length = Number(req.query.length) || 10;
    const page = Math.floor(start / length) + 1;
    const results = await acordaos.list(length, page);
    const data = results.acordaos;
    const recordsTotal = results.count;
    const result = {
      draw: req.query.draw ? Number(req.query.draw) : 1,
      recordsTotal: recordsTotal,
      recordsFiltered: recordsTotal,
      data: data
    };
    res.json(result);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});


/* GET edit acordao. */
router.get('/acordao/edit/:id', verificaAutenticacao, function(req, res) {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }
  const acordao = acordaos.findByID(id)
    .then(dados => {
      courts.list().then(cts => {
        res.render('editAcordao', { acordao: dados, courts: cts, u: req.user });
      });
    })
    .catch(erro => {
      res.status(520).render('Error', { message: 'Error processing your request.\n' + erro, u: req.user });
    });
});


/* GET acordão by id. */
router.get('/acordao/:id', async function(req, res) {
  var id = req.params.id;
  try {
    const acordao = await acordaos.findByID(id);
    if (acordao) {
      if (req.user) {
        var favorite = null;
        const favorites = await User.getFavorites(req.user._id);
        const favoriteItem = favorites.find(fav => fav.acordaoId === id);
        if (favoriteItem) favorite = favoriteItem.title;
        res.render('acordao', { acordao: acordao, favorite: favorite, showFav: true, u: req.user });
      } else {
        res.render('acordao', { acordao: acordao, showFav: false, u: req.user });
      }
    } else {
      res.status(404).render('notfound', { message: 'Acordão not found' });
    }
  } catch(err) {
    res.status(520).render('notfound', { message: err.message, u: req.user });
  }
});


/* GET Acordaos by word search. */
router.get('/acordaos/search', function(req, res) {
  const search = req.query.search;
  if (!search) {
    acordaos.list()
    .then(dados => {
      courts.list().then(dados => {
        res.render('acordaos', { courts: dados, u: req.user });
      })
    })
    .catch(erro => {
      res.status(520).render('Error', { message: 'Error processing your request.\n' + erro, u: req.user });
    }
  );
  }
  else{
    acordaos.findByWords(search)
    .then(dados => {
      courts.list().then(cts => {
        res.render('acordaosStatic', { results: dados, search: search, courts: cts, u: req.user });
      });
    })
    .catch(erro => {
      res.status(520).render('Error', { message: 'Error processing your request.\n' + erro, u: req.user });
    }
    );
  }
});


/* GET Acordaos by filter data. */
router.get('/acordaos/filter/data', async function(req, res) {
  const filter = req.query.category;
  const page = parseInt(req.query.start) / parseInt(req.query.length) + 1;
  const pageSize = parseInt(req.query.length);
  if (!filter || filter === 'all') {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }
  try {
    const result = await acordaos.findByCourt(filter, page, pageSize);
    res.status(200).json({ success: true, data: result.results, draw: req.query.draw ? Number(req.query.draw) : 1, recordsTotal: result.pagination.totalRecords, recordsFiltered: result.pagination.totalRecords});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


/* GET Acordaos by court filter. */
router.get('/acordaos/filter', async function(req, res) {
  const filter = req.query.category;
  if (!filter || filter == 'all') {
    courts.list().then(dados => {
      res.render('acordaos', { filter: 'All', courts: dados, u: req.user });
    });
  } else {
    try {
      courts.list().then(dados => {
        res.render('acordaosFilter', { filter: filter, courts:dados, u: req.user });
      })
    } catch (error) {
      res.status(520).render('notFound', { message: 'Error processing your request.\n' + error, u: req.user });
    }
  }
});


/* GET Add acordao page. */
router.get('/acordaos/add', verificaAutenticacao, function(req, res) {
  const fields = ['Nº Convencional', 'Nº do Documento', 'Processo', 'Acordão', 'Nº Processo/TAF', 'Relator', 'Descritores', 'Data',
    'Data do Acordão', 'Data da Decisão', 'Data de Entrada', 'Espécie', 'Requerente', 'Requerido', 'Recorrente', 'Recorrido 1', 'Recorrido 2',
    'Votação', 'Privacidade', 'Normas Apreciadas', 'Normas Julgadas Inconst.', 'Contecioso', 'Peça Processual', 'Área Temática 1',
    'Área Temática 2', 'Normas Suscitadas', 'Nº do Diário da República', 'Data do Diário da República', 'Página do Diário da República',
    'Legislação Nacional', 'Secção', 'Sub-secção', 'Juízo ou Secção', 'Tipo de Ação', 'Tipo de Contrato', 'Autor', 'Decisão', 'Sumário',
    'Decisão Texto Integral', 'Texto Integral', 'Texto das Cláusulas Abusivas', 'Tema', 'Recursos', 'Meio Processual', 'Tribunal', 'Réu',
    'url'
  ];
  courts.list().then(dados => {
    res.render('addAcordao', { fields: fields, courts: dados, u: req.user });
  })
  .catch(erro => {
    res.status(520).render('Error', { message: 'Error processing your request.\n' + erro, u: req.user });
  });
});


/* GET Add court page. */
router.get('/courts/add', verificaAutenticacao, function(req, res) {
  if (req.user.level == 1){
    res.render('addCourt', { u: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});


/* GET Reviews page. */
router.get('/reviews', verificaAutenticacao, function(req, res) {
  if (req.user.level == 1){
    updates.listNew()
    .then(async dados => {
      var reviews = [];
      for (var i = 0; i < dados.length; i++) {
        dados[i].username = await User.findById(dados[i].userId).then(user => user.username);
        if (dados[i].isNew) reviews.push(dados[i]);
      }
      res.render('reviews', { reviews: reviews, u: req.user });
    })
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});


/* GET Reviews from a acordao. */
router.get('/reviews/:id', verificaAutenticacao, function(req, res) {
  const id = req.params.id;
  updates.listByAcordao(id)
    .then(async dados => {
      for (var i = 0; i < dados.length; i++) {
        dados[i].username = await User.findById(dados[i].userId).then(user => user.username);
      }
      dados.reverse();
      res.render('reviewsAcordao', { reviews: dados, acordaoId: id, u: req.user });
    })
    .catch(erro => { 
      res.status(520).render('Error', { message: 'Error processing your request.\n' + erro, u: req.user });
    });
});


/* GET Taxonomy page. */
router.get('/taxonomy', function(req, res) {
  acordaos.listDescriptors()
    .then(dados => {
      res.render('taxonomy', { descriptors: dados, u: req.user });
    })
    .catch(erro => {
      res.status(520).render('Error', { message: 'Error processing your request.\n' + erro, u: req.user });
    });
});


/* GET Taxonomy data. */
router.get('/taxonomy/data', async function(req, res) {
  try {
    const start = Number(req.query.start) || 0;
    const length = Number(req.query.length) || 10;
    const page = Math.floor(start / length) + 1;
    const results = await acordaos.listDescriptors(page, length);
    const result = {
      draw: req.query.draw ? Number(req.query.draw) : 1,
      recordsTotal: results.total || 0,
      recordsFiltered: results.total || 0,
      data: results.data || []
    };
    res.json(result);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});


/* GET Taxonomy results page. */
router.get('/taxonomy/:tax', function(req, res) {
  const tax = req.params.tax;
  acordaos.findByDescriptor(tax)
    .then(dados => {
      courts.list().then(cts => {
        res.render('acordaosStatic', { results: dados, tax: tax, courts: cts, u: req.user });
      })
    })
    .catch(erro => {
      res.status(520).render('Error', { message: 'Error processing your request.\n' + erro, u: req.user });
    });
});
  

/* ************ */
/* POST METHODS */
/* ************ */


/* POST Add acordao. */
router.post('/acordaos/add', verificaAutenticacao, function(req, res) {
  const acordao = req.body;

  if (!acordao) {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }

  if (req.user.level == 1){
  acordaos.insert(acordao)
    .then(() =>
      res.redirect('/'))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    });
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});


/* POST Add court. */
router.post('/courts/add', verificaAutenticacao, function(req, res) {
  const sigla = req.body.sigla;
  const value = req.body.value;

  if (!sigla || !value) {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }

  courts.add(sigla, value)
    .then(() => 
    res.redirect('/'))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    });
});


/* POST UPDATE Acordao or suggest UPDATE. */
router.post('/acordaos/update/:id', verificaAutenticacao, async function(req, res) {
  const acordaoId = req.params.id;
  const acordao = req.body;
  if (!acordaoId || !acordao) {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }
  var changes = [];
  await acordaos.findByID(acordaoId)
    .then(oldAcordao => {
      for (var key in oldAcordao._doc) {
        try {
          if (oldAcordao._doc[key] === acordao[key]) continue;
          else if (key == '_id' || key == 'Descritores' || key == 'url') continue;
          else if ((key == 'Data da Decisão' || key == 'Data de Entrada' || key == 'Data do Acordão' || key == 'Data do Diário da República') && oldAcordao._doc[key].toISOString().substring(0,10) === acordao[key]) continue;
          else if (oldAcordao._doc[key] === {} && acordao[key] === undefined) continue;
          else if (key === 'Normas Julgadas Inconst') continue;
          else {
            changes.push({ field: key, old: oldAcordao._doc[key], new: acordao[key] });
          }
        } catch (error) {
          console.log(error);
        }
      }
    })
  if (req.user.level == 1) {
    updates.add(req.user._id, acordaoId, changes, 1).then(() => {
      acordaos.update(acordaoId, acordao)
        .then(() => res.redirect('/acordao/' + acordaoId))
      }).catch((err) => {
        res.status(500).json({ success: false, message: 'Server error' });
      });
  } else {
    updates.add(req.user._id, acordaoId, changes, 3).then(() => {
      res.redirect('/acordao/' + acordaoId);
    }).catch((err) => {
      res.status(500).json({ success: false, message: 'Server error' });
    });
  }
});


/* POST Accept UPDATE. */
router.post('/acordaos/acceptUpdate/:id', verificaAutenticacao, function(req, res) {
  const acordaoId = req.params.id;
  const updateId = req.body.updateId;
  if (!acordaoId || !updateId) {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }
  if (req.user.level == 1) {
    updates.getById(updateId).then(update => {
      var changes = {};
      for (var i = 0; i < update.fields.length; i++) {
        key = update.fields[i].field;
        value = update.fields[i].new;
        changes[key] = value;
      }
      acordaos.update(acordaoId, changes).then(() => {
        updates.setNotNew(updateId, 1, req.user.username).then(() => {
          res.redirect('/reviews');
        })
      }).catch((err) => {
        res.status(500).json({ success: false, message: 'Server error' });
      });
    }).catch((err) => {
      res.status(500).json({ success: false, message: 'Server error' });
    });
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});


/* POST Reject UPDATE. */
router.post('/acordaos/rejectUpdate/:id', verificaAutenticacao, function(req, res) {
  const acordaoId = req.params.id;
  const updateId = req.body.updateId;
  if (!acordaoId || !updateId) {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }
  if (req.user.level == 1) {
    updates.setNotNew(updateId, 2, req.user.username)
      .then(() => res.redirect('/reviews'))
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});


/* POST Add acordao to favorites. */
router.post('/acordaos/addFavorite/:id', verificaAutenticacao, function(req, res) {
  const acordaoId = req.params.id;
  const userId = req.user._id;
  const title = req.body.title;

  if (!acordaoId || !userId || !title) {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }
  
  User.addFavorite(userId, acordaoId, title)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    });
});


/* POST Remove acordao from favorites. */
router.post('/acordaos/removeFavorite/:id', verificaAutenticacao, function(req, res) {
  const acordaoId = req.params.id;
  const userId = req.user._id;

  if (!acordaoId || !userId) {
    res.status(400).json({ success: false, message: 'Missing parameters' });
    return;
  }
  
  User.removeFavorite(userId, acordaoId)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    });
});


module.exports = router;
