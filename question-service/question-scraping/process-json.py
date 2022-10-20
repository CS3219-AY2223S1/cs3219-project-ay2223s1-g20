import json

with open('data.json') as dataFile:    
    data = json.load(dataFile)
    processedData = []

    for doc in data['questions']:
        newEntry = {}
        questionContent = doc['questionDescription'].split("\n\xa0\n")
        if (len(questionContent) == 2):
            newEntry = {"difficulty": doc['difficulty'], "questionTitle": doc['questionTitle'], "questionDescription": questionContent[0], "examples": questionContent[1]}
        elif (len(questionContent) == 3):
            newEntry = {"difficulty": doc['difficulty'], "questionTitle": doc['questionTitle'], "questionDescription": questionContent[0], "examples": questionContent[1], "constraints": questionContent[2]}
        else:
            questionContent[2] = questionContent[2] + '\n' + questionContent[3]
            newEntry = {"difficulty": doc['difficulty'], "questionTitle": doc['questionTitle'], "questionDescription": questionContent[0], "examples": questionContent[1], "constraints": questionContent[2]}

        processedData.append(newEntry)

wrapProcessedData = {"questions": processedData}

with open("processed-data.json", "w") as outfile:
    outfile.write(json.dumps(wrapProcessedData, indent = 4))
        
        


