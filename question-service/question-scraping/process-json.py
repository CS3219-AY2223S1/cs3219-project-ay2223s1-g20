import json

with open('data.json') as data_file:    
    data = json.load(data_file)
    processed_data = []

    for doc in data['questions2']:
        new_entry = {}
        questionContent = doc['questionDescription'].split("\n\xa0\n")
        if (len(questionContent) == 2):
            new_entry = {"difficulty": doc['difficulty'], "questionTitle": doc['questionTitle'], "questionDescription": questionContent[0], "examples": questionContent[1]}
        elif (len(questionContent) == 3):
            new_entry = {"difficulty": doc['difficulty'], "questionTitle": doc['questionTitle'], "questionDescription": questionContent[0], "examples": questionContent[1], "constraints": questionContent[2]}
        else:
            questionContent[2] = questionContent[2] + '\n' + questionContent[3]
            new_entry = {"difficulty": doc['difficulty'], "questionTitle": doc['questionTitle'], "questionDescription": questionContent[0], "examples": questionContent[1], "constraints": questionContent[2]}

        processed_data.append(new_entry)

with open("processed-data.json", "a") as outfile:
    outfile.write(json.dumps((processed_data), indent = 4))
        
        


