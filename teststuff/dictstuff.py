import json

data = {}

with open("allcards.json", "r") as f:
    data_ = json.load(f)
    for card in data_["items"]:
        data[card["name"]] = card

with open("groups.json", "r") as f:
    groups = json.load(f)


for groupindex in range(len(groups["groups"])):
    for cardindex in range(len(groups["groups"][groupindex]["cards"])):
        if groups["groups"][groupindex]["cards"][cardindex]["name"] in data:
            groups["groups"][groupindex]["cards"][cardindex]["arena"] = data[groups["groups"][groupindex]["cards"][cardindex]["name"]]["arena"]
        else:
            print(f"Card {groups['groups'][groupindex]['cards'][cardindex]['name']} not found in allcards.json")


with open("groups.json", "w") as f:
    json.dump(groups, f, indent=2)