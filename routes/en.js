import express from "express";
const router = express.Router();
import axios from "axios";
import * as  cheerio from "cheerio";
import { pronounce } from "node-pronounce";
import randomUseragent from "random-useragent";
const rua = randomUseragent.getRandom();
var wordOfDay = [];
const baseUrl = 'https://randomword.com';

router.get("/", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("Strict-Transport-Security", "max-age=63072000");
  res.setHeader("Content-Type", "application/json");

  axios({
    method: "GET",
    url: baseUrl,
    headers: {
      "User-Agent": rua,
    },
  })
    .then(function (response) {
      const $ = cheerio.load(response.data);
      if (wordOfDay.length > 0) {
        wordOfDay = [];
      }

      var post = $(".section #shared_section");
      var word = post
        .find("#random_word")
        .eq(0)
        .text()
        .replace("\r\n\t\t\t\t\t", "")
        .replace("\r\n\t\t\t\t", "")
        .replace("\n\t\t\t\t\t", "")
        .replace("\n\t\t\t\t", "");
      var definition = post
        .find("#random_word_definition")
        .eq(0)
        .text()
        .replace("\n", "");
      var pronounceword = pronounce(word).replace(",", "");

      wordOfDay.push({
        word: decodeURI(word.charAt(0).toUpperCase() + word.slice(1)),
        definition: decodeURI(
          definition.charAt(0).toUpperCase() + definition.slice(1)
        ),
        pronunciation: decodeURI(
          pronounceword.charAt(0).toUpperCase() + pronounceword.slice(1)
        ),
      });
      res.send(JSON.stringify(wordOfDay, null, 2));
    })
    .catch(function (error) {
      if (!error.response) {
        console.log("API URL is Missing");
        res.json("API URL is Missing");
      } else {
        console.log("Something Went Wrong - Enter the Correct API URL");
        res.json("Something Went Wrong - Enter the Correct API URL");
      }
    });
});

router.get("/:pos", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("Strict-Transport-Security", "max-age=63072000");
  res.setHeader("Content-Type", "application/json");

  const partOfSpeech = req.params.pos;

  axios({
    method: "GET",
    url: `${baseUrl}/${partOfSpeech}`,
    headers: {
      "User-Agent": rua,
    },
  })
    .then(function (response) {
      const $ = cheerio.load(response.data);
      if (wordOfDay.length > 0) {
        wordOfDay = [];
      }

      var post = $(".section #shared_section");
      var word = post
        .find("#random_word")
        .eq(0)
        .text()
        .replace("\r\n\t\t\t\t\t", "")
        .replace("\r\n\t\t\t\t", "")
        .replace("\n\t\t\t\t\t", "")
        .replace("\n\t\t\t\t", "");
      var definition = post
        .find("#random_word_definition")
        .eq(0)
        .text()
        .replace("\n", "");
      var pronounceword = pronounce(word).replace(",", "");

      wordOfDay.push({
        word: decodeURI(word.charAt(0).toUpperCase() + word.slice(1)),
        definition: decodeURI(
          definition.charAt(0).toUpperCase() + definition.slice(1)
        ),
        pronunciation: decodeURI(
          pronounceword.charAt(0).toUpperCase() + pronounceword.slice(1)
        ),
      });
      res.send(JSON.stringify(wordOfDay, null, 2));
    })
    .catch(function (error) {
      if (!error.response) {
        console.log("API URL is Missing");
        res.json("API URL is Missing");
      } else {
        console.log("Something Went Wrong - Enter the Correct API URL");
        res.json("Something Went Wrong - Enter the Correct API URL");
      }
    });
});

export default router;