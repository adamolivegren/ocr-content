let ingredients;
getData().then((result) => {
  ingredients = result;
});
let existingWords = [];
let missingWords = [];

const textToArray = (text) => {
  let array = text.split(",");
  array = array.map((element) => element.trim()); // removes spaces in start and end of strings
  for (var i = 0; i < array.length; ++i) {
    array[i] = array[i].replace(/(\r\n|\n|\r)/gm, " "); // removes line breaks in array elements
  }
  return array;
};

const highlightText = (existingWords, missingWords, array) => {
  existingWords.forEach((e) => {
    array[array.indexOf(e)] = "<span style='color: green'>" + e + "<span>";
  });
  missingWords.forEach((e) => {
    array[array.indexOf(e)] = "<span style='color: red'>" + e + "<span>";
  });

  return array.join(", ");
};

const printResult = (text) => {
  const result = document.querySelector(".result");
  result.style.display = "block";

  let array = textToArray(text);
  array.forEach((element) => {
    ingredients.map((ingredient) => {
      if (ingredient.Name === element && ingredient.Desc) {
        existingWords.push(element);
      }
    });
  });
  missingWords = array.filter((n) => !existingWords.includes(n));

  /* Highlight words */
  const highlightedText = highlightText(existingWords, missingWords, array);
  document.querySelector(".result-text").innerHTML = highlightedText;
};

const analyzeContent = () => {
  const result = document.querySelector(".result-bad");
  document.querySelector(".result-bad").hasChildNodes
    ? (document.querySelector(".result-bad").style.display = "block")
    : null;

  /* Print each bad ingredient */
  ingredients.forEach((e) => {
    if (existingWords.includes(e.Name) && e.Name && e.Grading >= 3) {
      const element = document.createElement("h4");
      const elementNode = document.createTextNode(e.Name);
      element.appendChild(elementNode);
      const para = document.createElement("p");

      if (e.Desc) {
        const paraNode = document.createTextNode(e.Desc);
        para.appendChild(paraNode);
      } else {
        const paraNode = document.createTextNode("Beskrivning saknas.");
        para.appendChild(paraNode);
      }
      result.appendChild(element);
      result.appendChild(para);
    }
  });
  document.querySelector(".analyze-button").style.display = "none";
};

const runOCR = () => {
  showLoadingAnimation();
  Tesseract.recognize(img, "eng").then(
    ({ data: { text, hocr, tsv, blocks } }) => {
      // console.log(blocks[0].paragraphs[1].lines[0].words[0].text);
      const parser = new DOMParser();
      const hocrDoc = parser.parseFromString(hocr, "text/html");

      const wordElements = hocrDoc.querySelectorAll("span.ocrx_word");

      wordElements.forEach((wordElement) => {
        const bbox = wordElement
          .getAttribute("title")
          .match(/bbox (\d+) (\d+) (\d+) (\d+)/);
        const x = parseInt(bbox[1], 10);
        const y = parseInt(bbox[2], 10);
        const width = parseInt(bbox[3], 10) - x;
        const height = parseInt(bbox[4], 10) - y;
      });

      hideLoadingAnimation();
      printResult(text);
      document.querySelector(".analyze-button").style.display = "flex";
      document.querySelector(".ocr-button").style.display = "none";
      document.querySelector(".reset-button").style.display = "flex";
      document.querySelector(".outer-div").style.justifyContent = "flex-start";
      document.querySelector(".logo").style.marginTop = "5vh";
    }
  );
};
