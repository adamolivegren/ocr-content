async function getData() {
  // Fetch the contents of the CSV file
  const response = await fetch("database.csv");

  // Get the contents of the file as a string
  const csvString = await response.text();

  // Split the string into an array of lines
  const lines = csvString.split("\n");

  // Get the headers (first line of the CSV)
  const headers = lines[0].split(",");

  // Convert the remaining lines to an array of objects
  const data = lines.slice(1).map((line) => {
    // Split the line into an array of values
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    // Reduce the array of values to an object
    return values.reduce((obj, value, i) => {
      obj[headers[i]] = value;
      return obj;
    }, {});
  });

  return data;
}
