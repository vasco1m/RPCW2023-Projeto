var mongoose = require('mongoose');

var acordaosSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    "Nº Convencional": {
        type: String,
        required: false
    },
    "Acordão": {
        type: String,
        required: false
    },
    "Processo": {
        type: String,
        required: false
    },
    "Nº Processo/TAF": {
        type: String,
        required: false
    },
    "Relator": {
        type: String,
        required: false
    },
    "Descritores": [String],
    "Nº do Documento": {
        type: String,
        required: false
    },
    "Data": {
        type: Date,
        required: false
    },
    "Data do Acordão": {
        type: Date,
        required: false
    },
    "Data da Decisão": {
        type: Date,
        required: false
    },
    "Data de Entrada": {
        type: Date,
        required: false
    },
    "Espécie": {
        type: String,
        required: false
    },
    "Magistrado": {
        type: String,
        required: false
    },
    "Requerente": {
        type: String,
        required: false
    },
    "Requerido": {
        type: String,
        required: false
    },
    "Recorrente": {
        type: String,
        required: false
    },
    "Recorrido 1": {
        type: String,
        required: false
    },
    "Recorrido 2": {
        type: String,
        required: false
    },
    "Votação": {
        type: String,
        required: false
    },
    "Privacidade": {
        type: String,
        required: false
    },
    "Normas Apreciadas": {
        type: String,
        required: false
    },
    "Normas Julgadas Inconst.": {
        type: String,
        required: false
    },
    "Contencioso": {
        type: String,
        required: false
    },
    "Peça Processual": {
        type: String,
        required: false
    },
    "Área Temática 1": {
        type: String,
        required: false
    },
    "Área Temática 2": {
        type: String,
        required: false
    },
    "Normas Suscitadas": {
        type: String,
        required: false
    },
    "Nº do Diário da República": {
        type: String,
        required: false
    },
    "Data do Diário da República": {
        type: String,
        required: false
    },
    "Página do Diário da República": {
        type: String,
        required: false
    },
    "Indicações Eventuais": {
        type: String,
        required: false
    },
    "Legislação Nacional": {
        type: String,
        required: false
    },
    "Secção": {
        type: String,
        required: false
    },
    "Sub-Secção": {
        type: String,
        required: false
    },
    "Juízo ou Secção": {
        type: String,
        required: false
    },
    "Tipo de Ação": {
        type: String,
        required: false
    },
    "Tipo de Contrato": {
        type: String,
        required: false
    },
    "Autor": {
        type: String,
        required: false
    },
    "Decisão": {
        type: String,
        required: false
    },
    "Sumário": {
        type: String,
        required: false
    },
    "Decisão Texto Integral": {
        type: String,
        required: false
    },
    "Texto Integral": {
        type: String,
        required: false
    },
    "Texto das Cláusulas Abusivas": {
        type: String,
        required: false
    },
    "Tema": {
        type: String,
        required: false
    },
    "Recursos": {
        type: String,
        required: false
    },
    "Meio Processual": {
        type: String,
        required: false
    },
    "Tribunal": {
        type: String,
        required: false
    },
    "Réu": {
        type: String,
        required: false
    },
    "url": String,
    "tribunal": String
});

module.exports = mongoose.model('acordaos', acordaosSchema);