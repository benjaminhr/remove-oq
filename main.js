const fs = require("fs");
const xml2js = require("xml2js");
const builder = new xml2js.Builder();

fs.readFile("learnedConcreteModel.xml", "utf-8", (err, data) => {
  if (err) console.log(err);

  xml2js.parseString(data, (err, json) => {
    if (err) console.log(err);

    let locations = json.nta.template[0].location;
    let transitions = json.nta.template[0].transition;

    for (let i = 0; i < transitions.length - 1; i++) {
      const currentTransition = transitions[i];
      const nextTransition = transitions[i + 1];

      const foundOq = nextTransition.label.find((l) => {
        return Object.values(l).includes("Oquiescence()");
      });

      if (foundOq) {
        const locationId = currentTransition.target[0]["$"]["ref"];
        locations = locations.filter((loc) => loc["$"].id !== locationId);
        transitions[i] = false;
        transitions[i + 1] = false;
      }
    }

    json.nta.template[0].transition = transitions.filter((tran) => tran);
    json.nta.template[0].location = locations;

    // // console.log(JSON.stringify(transitions, null, 2));

    const xml = builder.buildObject(json);
    fs.writeFile("new_learnedConcreteModel.xml", xml, (err, data) => {
      if (err) console.log(err);
      console.log("successfully written our update xml to file");
    });
  });
});
