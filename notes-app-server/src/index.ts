import express from "express"
import cors from "cors"

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();

    res.json(notes);
});

app.listen(5000, () => {
    console.log("server running on localhost:5000")
});