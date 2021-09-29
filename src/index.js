const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const currentRepository = repositories.find(repository => repository.id === id);

  if (!currentRepository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  currentRepository.title = title;
  currentRepository.url = url;
  currentRepository.techs = techs;

  const updatedRepository = {
    id: currentRepository.id,
    title,
    url,
    techs,
    likes: currentRepository.likes
  }

  return response.status(200).json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const currentRepository = repositories.find(repository => repository.id === id);

  if (!currentRepository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  currentRepository.likes = currentRepository.likes + 1;

  return response.status(200).json(currentRepository);
});

module.exports = app;
