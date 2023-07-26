"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRouter = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const config = {
    protocol: "amqp",
    hostname: "3.229.42.196",
    port: 5672,
    username: "guest",
    password: "guest",
};
exports.loadRouter = express_1.default.Router();
// Usamos bodyParser para analizar el cuerpo de las solicitudes POST en formato JSON
exports.loadRouter.use(body_parser_1.default.json());
exports.loadRouter.post("/create", function loadEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Obtén los datos del nuevo usuario desde el cuerpo de la solicitud
            const dataSensor = req.body;
            // Si el cuerpo no contiene los datos esperados, responde con un error
            if (!dataSensor.pulso_cardiaco && !dataSensor.temperatura) {
                return res.status(400).json({ error: "Datos del sensor incompletos" });
            }
            const conn = yield amqplib_1.default.connect(config);
            console.log("Conexión exitosa");
            const channel = yield conn.createChannel();
            console.log("Canal creado exitosamente");
            const message = JSON.stringify(dataSensor);
            yield channel.sendToQueue("mqtt", Buffer.from(message));
            console.log("Mensaje enviado:");
            console.log(message);
            yield channel.close();
            yield conn.close();
            res.status(201).send({
                status: "success",
                message: "Datos enviado"
            });
            // res.status(200).send("OK --> Usuario enviado");
        }
        catch (error) {
            // Manejar cualquier error que ocurra durante las operaciones asíncronas
            console.error("Error en la operación:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });
});
/*import amqp from "amqplib";
import express from "express";

const config = {
  protocol: "amqp",
  hostname: "3.229.42.196",
  port: 5672,
  username: "guest",
  password: "guest",
};

export const loadRouter = express.Router();

loadRouter.get("/", async function loadEvent(req, res) {
  const conn = await amqp.connect(config);
  console.log("Conexión exitosa");
  const channel = await conn.createChannel();
  console.log("Canal creado exitosamente");

  let data = {
    id: 1,
    pulso_cardiaco:"23 ",
    temperatura:45
  }

  await channel.sendToQueue("mqtt", Buffer.from(JSON.stringify(data)));
  console.log("Mensaje enviado");
  await channel.close();
  await conn.close();
  res.status(200).send("OK");
});*/
