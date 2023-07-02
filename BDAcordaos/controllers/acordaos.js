const { data } = require('jquery');
var Acordaos = require('../models/acordaos');
const Redis = require('ioredis');
const redis = new Redis();

// Display list of all judgments basic info.
module.exports.list = async function(perPage, page) {
  try {
    const cacheKey = `acordaos:count`;
    let count = await redis.get(cacheKey);
    if (count === null) {
      count = await Acordaos.countDocuments().exec();
      await redis.set(cacheKey, count, 'EX', 60 * 60 * 24);
    }

    let acordaos = await Acordaos
      .find({}, {"Nº Convencional": 1, "Acordão": 1, "Processo": 1, "Nº Processo/TAF": 1, "Nº do Documento": 1, 
      "Data do Acordão": 1, "Data": 1, "Data da Decisão": 1, "Data de Entrada": 1,
      "tribunal": 1, "url": 1, "_id": 1})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();

    return { acordaos: acordaos, count: count };
  } catch (erro) {
    return erro;
  }
};

module.exports.findByCourt = async function(court, page, pageSize) {
  try {
    const cacheKey = `acordaos:${court}:count`;
    const totalCount = await redis.get(cacheKey);
    if (totalCount === null) {
      const count = await Acordaos.countDocuments({ tribunal: court }).exec();
      await redis.set(cacheKey, count, 'EX', 60 * 60 * 24);
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    const skip = (page - 1) * pageSize;

    const results = await Acordaos.find(
      { tribunal: court },
      {
        "Nº Convencional": 1,
        "Acordão": 1,
        "Processo": 1,
        "Nº Processo/TAF": 1,
        "Nº do Documento": 1,
        "Data do Acordão": 1,
        "Data": 1,
        "Data da Decisão": 1,
        "Data de Entrada": 1,
        "tribunal": 1,
        "url": 1,
        "_id": 1
      }
    )
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec();

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalRecords: totalCount
    };
    return {
      results: results,
      pagination: pagination
    };
  } catch (error) {
    throw error;
  }
};

module.exports.findByWords = async function(words) {
    const regex = new RegExp(words, 'i');
    try {
      return Acordaos.find({ $or: [
        {"Nº Convencional": regex },
        {"Acordão": regex },
        {"Processo": regex },
        {"Nº Processo/TAF": regex },
        {"Relator": regex },
        {"Descritores": regex },
        {"Nº do Documento": regex },
        {"Espécie": regex},
        {"Magistrado": regex},
        {"Requerente": regex},
        {"Requerido": regex},
        {"Recorrido": regex},
        {"Recorrido 1": regex},
        {"Recorrido 2": regex},
        {"Votação": regex},
        {"Privacidade": regex},
        {"Normas Apreciadas": regex},
        {"Normas Julgadas Inconst.": regex},
        {"Contencioso": regex},
        {"Peça Processual": regex},
        {"Área Temática 1": regex},
        {"Área Temática 2": regex},
        {"Normas Suscitadas": regex},
        {"Nº do Diário da República": regex},
        {"Indicações Eventuais": regex},
        {"Legislação Nacional": regex},
        {"Secção": regex},
        {"Sub-Secção": regex},
        {"Juízo ou Secção": regex},
        {"Tipo de Ação": regex},
        {"Tipo de Contrato": regex},
        {"Autor": regex},
        {"Decisão": regex},
        {"Sumário": regex},
        {"Decisão Texto Integral": regex},
        {"Texto Integral": regex},
        {"Texto das Cláusulas Abusivas": regex},
        {"Tema": regex},
        {"Recursos": regex},
        {"Meio Processual": regex},
        {"Tribunal": regex},
        {"Réu": regex},
        {"Normas Suscitadas": regex},
        {"Página do Diário da República": regex},
        {"tribunal": regex },
        {"url": regex }
      ]
    }, {"Nº Convencional": 1, "Acordão": 1, "Processo": 1, "Nº Processo/TAF": 1, "Nº do Documento": 1,
    "Data do Acordão": 1, "Data": 1, "Data da Decisão": 1, "Data de Entrada": 1,
    "tribunal": 1, "_id": 1})
      .then(dados => {
          return dados;
      }
    );
    } catch (erro) {
      return erro;
    }
  }

module.exports.findByFields = async function(fields) {
  try {
    return Acordaos.find({ $or: [
      {"Nº Convencional": new RegExp(fields['Nº Convencional'], 'i') },
      {"Acordão": new RegExp(fields['Acordão'], 'i') },
      {"Processo": new RegExp(fields['Processo'], 'i') },
      {"Nº Processo/TAF": new RegExp(fields['Nº Processo/TAF'], 'i') },
      {"Relator": new RegExp(fields['Relator'], 'i') },
      {"Descritores": new RegExp(fields['Descritores'], 'i') },
      {"Nº do Documento": new RegExp(fields['Nº do Documento'], 'i') },
      {"Espécie": new RegExp(fields['Espécie'], 'i') },
      {"Magistrado": new RegExp(fields['Magistrado'], 'i') },
      {"Requerente": new RegExp(fields['Requerente'], 'i') },
      {"Requerido": new RegExp(fields['Requerido'], 'i') },
      {"Recorrido": new RegExp(fields['Recorrido'], 'i') },
      {"Recorrido 1": new RegExp(fields['Recorrido 1'], 'i') },
      {"Recorrido 2": new RegExp(fields['Recorrido 2'], 'i') },
      {"Votação": new RegExp(fields['Votação'], 'i') },
      {"Privacidade": new RegExp(fields['Privacidade'], 'i') },
      {"Normas Apreciadas": new RegExp(fields['Normas Apreciadas'], 'i') },
      {"Normas Julgadas Inconst.": new RegExp(fields['Normas Julgadas Inconst.'], 'i') },
      {"Contencioso": new RegExp(fields['Contencioso'], 'i') },
      {"Peça Processual": new RegExp(fields['Peça Processual'], 'i') },
      {"Área Temática 1": new RegExp(fields['Área Temática 1'], 'i') },
      {"Área Temática 2": new RegExp(fields['Área Temática 2'], 'i') },
      {"Normas Suscitadas": new RegExp(fields['Normas Suscitadas'], 'i') },
      {"Nº do Diário da República": new RegExp(fields['Nº do Diário da República'], 'i') },
      {"Indicações Eventuais": new RegExp(fields['Indicações Eventuais'], 'i') },
      {"Legislação Nacional": new RegExp(fields['Legislação Nacional'], 'i') },
      {"Secção": new RegExp(fields['Secção'], 'i') },
      {"Sub-Secção": new RegExp(fields['Sub-Secção'], 'i') },
      {"Juízo ou Secção": new RegExp(fields['Juízo ou Secção'], 'i') },
      {"Tipo de Ação": new RegExp(fields['Tipo de Ação'], 'i') },
      {"Tipo de Contrato": new RegExp(fields['Tipo de Contrato'], 'i') },
      {"Autor": new RegExp(fields['Autor'], 'i') },
      {"Decisão": new RegExp(fields['Decisão'], 'i') },
      {"Sumário": new RegExp(fields['Sumário'], 'i') },
      {"Decisão Texto Integral": new RegExp(fields['Decisão Texto Integral'], 'i') },
      {"Texto Integral": new RegExp(fields['Texto Integral'], 'i') },
      {"Texto das Cláusulas Abusivas": new RegExp(fields['Texto das Cláusulas Abusivas'], 'i') },
      {"Tema": new RegExp(fields['Tema'], 'i') },
      {"Recursos": new RegExp(fields['Recursos'], 'i') },
      {"Meio Processual": new RegExp(fields['Meio Processual'], 'i') },
      {"Tribunal": new RegExp(fields['Tribunal'], 'i') },
      {"Réu": new RegExp(fields['Réu'], 'i') },
      {"Normas Suscitadas": new RegExp(fields['Normas Suscitadas'], 'i') },
      {"Página do Diário da República": new RegExp(fields['Página do Diário da República'], 'i') },
      {"tribunal": new RegExp(fields['tribunal'], 'i') },
      {"url": new RegExp(fields['url'], 'i') }
    ]
  }, {"Nº Convencional": 1, "Acordão": 1, "Processo": 1, "Nº Processo/TAF": 1, "Nº do Documento": 1,
  "Data do Acordão": 1, "Data": 1, "Data da Decisão": 1, "Data de Entrada": 1,
  "tribunal": 1, "_id": 1})
    .then(dados => {
        return dados;
    }
  );
  } catch (erro) {
    return erro;
  }
}

module.exports.listDescriptors = async function(page, pageSize) {
  try {
    const cacheKey = `descriptors`;
    let desc = await redis.get(cacheKey);
    if (desc === null) {
      var descritores = [];
      return Acordaos.find({}, {"Descritores": 1})
        .then(dados => {
          dados.forEach(element => {
            element.Descritores.forEach(descritor => {
              
              if (!descritores.includes(descritor)) {
                descritores.push(descritor);
              }
            });
          });
          redis.set(cacheKey, JSON.stringify(descritores), 'EX', 60 * 60 * 24);
          return descritores;
        }
      );
    }
    else {
      const init = (page - 1) * pageSize;
      const end = init + pageSize;
      const data = JSON.parse(desc).slice(init, end);
      return {data: data, total: JSON.parse(desc).length};
    }
  } catch (erro) {
    console.log(erro);
    return erro;
  }
}

module.exports.findByDescriptor = async function(descritor) {
  try {
    const cacheKey = `${descritor}`;
    let desc = await redis.get(cacheKey);
    if (desc !== null) {
        var ids = JSON.parse(desc);
        return Acordaos.find({"_id": {$in: ids}}, {"Nº Convencional": 1, "Acordão": 1, "Processo": 1, "Nº Processo/TAF": 1, "Nº do Documento": 1,
        "Data do Acordão": 1, "Data": 1, "Data da Decisão": 1, "Data de Entrada": 1,
        "tribunal": 1, "_id": 1})
    } else {
      return Acordaos.find({"Descritores": descritor}, {"Nº Convencional": 1, "Acordão": 1, "Processo": 1, "Nº Processo/TAF": 1, "Nº do Documento": 1,
      "Data do Acordão": 1, "Data": 1, "Data da Decisão": 1, "Data de Entrada": 1,
      "tribunal": 1, "_id": 1})
        .then(dados => {
          var ids = [];
          dados.forEach(element => {
            ids.push(element._id);
          });
          redis.set(cacheKey, JSON.stringify(ids), 'EX', 60 * 60 * 24);

          return dados;
        }
      );
    }
  } catch (erro) {
    return erro;
  }
}

module.exports.findByID = async function(id) {
    try {
      return Acordaos.findOne({"_id": id})
      .then(dados => {
          return dados;
      }
    );
    } catch (erro) {
      return erro;
    }
}

module.exports.update = async function(id, acordao) {
  const updateDoc = {
    $set: acordao,
  };
  return Acordaos.updateOne({_id: id}, updateDoc)
    .then(dados => {
      return dados;
    })
    .catch(erro => {
      console.log(erro);
      return erro;
    });
};

module.exports.delete = async function(id) {
  try {
    const result = await Acordaos.deleteOne({ "_id": id }).exec();
    if (result.deletedCount > 0) {
      const cacheKey = `acordaos:count`;
      await redis.del(cacheKey);
    }
    return result;
  } catch (error) {
    return error;
  }
};

module.exports.insert = async function(acordao) {
  try {
    const result = await Acordaos.create(acordao);
    if (result) {
      const cacheKey = `acordaos:count`;
      await redis.del(cacheKey);
    }
    return result;
  } catch (error) {
    return error;
  }
};
