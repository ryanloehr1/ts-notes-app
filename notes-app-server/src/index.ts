//TODO: Standardize response messages on error
//TODO: Each time the local server crashes, it requires the user to kill the existing task on the port number and re-run npm. Does not output multiple error messages if crashing

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

//Pull a port from the env variables to ease access of changing
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();

    res.json(notes);
});

app.post("/api/notes", async(req, res) => {
    const { title, content } = req.body;

    if(!title || !content) {
    res.status(400).send({ message: "Title and content fields cannot be empty"});
    }
    try {
        const note = await prisma.note.create({
            data: { title, content },
        });
        res.json(note);
    } catch (error) {
        res.status(500).send({ message: "Something else went wrong"});
    }
});

app.put("/api/notes/:id", async(req, res) => {
    const {title, content} = req.body;
    const id = parseInt(req.params.id);
    
    if(!title || !content) {
        res.status(400).send({ message: "Title and content fields cannot be empty"});
    }

    if (!id || isNaN(id)) {
        res.status(400).send({ message: "Provided ID is not a valid number"});
    }

    try {
        const updatedNote =
            await prisma.note.update({
                where: {id},
                data: {title, content}
            });
            res.json(updatedNote);
    } catch (error) {
        res.status(500).send({ message: "Something else went wrong"});
    }

});

app.delete("api/notes/:id", async(req, res) =>{
    const id = parseInt(req.params.id);

    if(!id || isNaN(id)) {
        res.status(400).send({ message: "Provided ID is not a valid number"});
    }

    try {
        await prisma.note.delete({
            where: {id},
        });
        res.status(204).send(); //Successful, nothing to return
    } catch (error) {
        res.status(500).send({ message: "Something else went wrong"});
    }
});

app.listen(port, () => {
    console.log(`server running on localhost:${port}`);
});

//If the localhost server crashes, must first run 'netstat -ano | findstr :[INSERT_PORT_NUMBER]'
//and then from the response, then run 'taskkill /PID [RESPONSE_NUMBER] /F' to kill it
//then restart via standard npm