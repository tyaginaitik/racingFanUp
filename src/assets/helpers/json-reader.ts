declare function require(url: string);

export class JsonReader {
  public static getJson(fileName: String): any {
    let json = require("../json/" + fileName);
    return json;
  }
}
