class TrainSearch {
    trainIdSearchField;
    trainIdSuggestionBox;
    trainIdSearchBtn;
    trainNoSearchField;
    trainNoSuggestionBox;
    trainNoSearchBtn;
    resultTbody;
    resultBox;

    constructor() {
        this.trainIdSearchField = document.getElementById('trainIdSearchField');
        this.trainIdSuggestionBox = document.getElementById('trainIdSuggestionBox');
        this.trainIdSearchBtn = document.getElementById('trainIdSearchBtn');

        this.trainNoSearchField = document.getElementById('trainNoSearchField');
        this.trainNoSuggestionBox = document.getElementById('trainNoSuggestionBox');
        this.trainNoSearchBtn = document.getElementById('trainNoSearchBtn');

        this.resultTbody = document.getElementById('resultTbody');
        this.resultBox = document.getElementById('resultBox');

        window.onresize = this.suggestionBoxWidth;
        this.trainIdSearchField.onkeyup = this.suggestId;
        this.trainNoSearchField.onkeyup = this.suggestNo;
        this.trainIdSearchBtn.onclick = this.searchId;
        this.trainNoSearchBtn.onclick = this.searchNo;
        this.setSuggestionBoxWidth();
        this.hideTrainIdSuggestionBox();
        this.hideTrainNoSuggestionBox();
        this.hideResultBox();
    }

    setSuggestionBoxWidth = () => {
        this.trainIdSuggestionBox.style.width = this.trainIdSearchField.offsetWidth+'px';
        this.trainNoSuggestionBox.style.width = this.trainNoSearchField.offsetWidth+'px';
    }

    showTrainIdSuggestionBox = () => {
        this.trainIdSuggestionBox.style.display = 'block';
        
    }

    showTrainNoSuggestionBox = () => {
        this.trainNoSuggestionBox.style.display = 'block';
    }

    hideTrainIdSuggestionBox = () => {
        this.trainIdSuggestionBox.style.display = 'none';
        
    }

    hideTrainNoSuggestionBox = () => {
        this.trainNoSuggestionBox.style.display = 'none';   
    }

    hideResultBox = () => {
        this.resultBox.style.display = 'none';
    }

    showResultBox = () => {
        this.resultBox.style.display = 'block';
    }

    requestTrains = async () => {
        let response = await fetch('trains.json');
        let trains = await response.json();
        return trains;
    }

    putTrainsToTable = (trainArray) => {
        let resultHTML = '';
        for(let trainData of trainArray) {
            resultHTML +=
            `<tr>
                <td>${trainData.date}</td>
                <td>${trainData.locID}</td>
                <td>${trainData.trainNo}</td>
                <td>${trainData.comment}</td>
            </tr>`;
        }
        this.resultTbody.innerHTML = resultHTML;
    }

    showErrorMsg = (errorMsg) => {
        this.trainIdSearchField.value = '';
        this.trainNoSearchField.value = '';
        this.resultTbody.innerHTML = '';
        alert(errorMsg);
    }

    suggestId = () => {
        const searchTextId = this.trainIdSearchField.value.toString();
        if(searchTextId.length > 0) {
            this.showTrainIdSuggestionBox();

            const xhr = new XMLHttpRequest();
            xhr.open('get', 'trains.json');
            xhr.send();
            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    const trains = JSON.parse(xhr.responseText);

                    let suggestionHTML = '';
                    let allSuggestions = [];
                    for(let trainData of trains) {
                        if(trainData.locID.toLowerCase().startsWith(searchTextId.toLowerCase() )) {
                            allSuggestions.push(trainData.locID);
                            let suggestions = allSuggestions.sort();
                            
                            var newSuggestion =
                            '<p locnumber="'+trainData.locID+'" class="m-0 px-2 py-1">'+searchTextId+trainData.locID.slice(searchTextId.length)+'</p>';
                            console.log(suggestions);
                            if(!suggestionHTML.includes(newSuggestion)) {
                                suggestionHTML += newSuggestion;
                            }
                        
                        }
                    }

                    this.trainIdSuggestionBox.innerHTML = (suggestionHTML.length > 0) ? suggestionHTML :
                    '<p class="m-0 px-2 py-1">Nincs javaslat</p>';
                    
                    var trainIdSuggestions = document.querySelectorAll('#trainIdSuggestionBox p');
                    for(let suggestionP of trainIdSuggestions) {
                        suggestionP.onclick = this.setTrainIdSearchFieldValue;
                    }

                    /*
                    for(let trainData of trains) {
                        
                        if(trainData.locID.toLowerCase().startsWith(searchTextId.toLowerCase() )) {
                             allSuggestions.push(trainData.locID);
                             let suggestions = allSuggestions.sort();
                             console.log(suggestions);

                            allSuggestions.push(searchTextId+trainData.locID.slice(searchTextId.length));
                        
                            var newSuggestion =
                            '<p locnumber="'+trainData.locID+'" class="m-0 px-2 py-1">'+searchTextId+trainData.locID.slice(searchTextId.length)+'</p>';
                            if(!suggestionHTML.includes(newSuggestion)) {
                                suggestionHTML += newSuggestion;
                            }
                            
                        }
                    } */
                    
                    /*
                    let allSuggestions = [];
                    let suggestion = trainData.locID;
                    if(allSuggestions.includes(suggestion)) {
                        allSuggestions.push(suggestion);
                        suggestion += allSuggestions;
                    };
                    console.log(suggestion);
                    suggestion.push(allSuggestions);
                    suggestion.sort();
                    */

                    /*
                    this.trainIdSuggestionBox.innerHTML = (suggestionHTML.length > 0) ? suggestionHTML :
                    '<p class="m-0 px-2 py-1">Nincs javaslat</p>';
                    
                    var trainIdSuggestions = document.querySelectorAll('#trainIdSuggestionBox p');
                    for(let suggestionP of trainIdSuggestions) {
                        suggestionP.onclick = this.setTrainIdSearchFieldValue;
                    } */
                }
            }
        } else {
            this.hideTrainIdSuggestionBox();
        }

    }

    setTrainIdSearchFieldValue = (event) => {
        this.trainIdSearchField.value = event.target.getAttribute('locnumber');
        this.hideTrainIdSuggestionBox();
    }

    searchId = async () => {
        const searchTextId = this.trainIdSearchField.value.toLowerCase();

        if(searchTextId.length > 0) {
            let trains = await this.requestTrains();
                let result = [];
                for(let trainData of trains) {
                    if(searchTextId.toLowerCase() == trainData.locID.toLowerCase() ) {
                        result.push(trainData);
                        }
                    }
                    if(result.length > 0) {
                        this.showResultBox();
                        this.putTrainsToTable(result);
                    } else {
                        this.showErrorMsg('Nincs találat!');
                    }
        } else {
            this.showErrorMsg('Üres keresési mező!');
        }
    }

    suggestNo = () => {
        const searchTextNo = this.trainNoSearchField.value.toLowerCase();
        if(searchTextNo.length > 0) {
            this.showTrainNoSuggestionBox();
        }

        const xhr = new XMLHttpRequest();
        xhr.open('get', 'trains.json');
        xhr.send();
        xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 && xhr.status == 200) {
            const trains = JSON.parse(xhr.responseText);

            let suggestionHTML = '';
            for(let trainData of trains) {
                if(trainData.trainNo.toLowerCase().startsWith(searchTextNo.toLowerCase() ) ) {
                    let newSuggestion =
                        '<p trainnumber="'+trainData.trainNo+'" class="m-0 px-2 py-1">'+searchTextNo+trainData.trainNo.slice(searchTextNo.length)+'</p>';
                        if(!suggestionHTML.includes(newSuggestion)) {
                            suggestionHTML += newSuggestion;
                        }
                }
            }

            this.trainNoSuggestionBox.innerHTML = (suggestionHTML.length > 0) ? suggestionHTML :
            '<p class="m-0 px-2 py-1">Nincs javaslat</p>';
                    
                    let trainNoSuggestions = document.querySelectorAll('#trainNoSuggestionBox p');
                    for(let suggestionP of trainNoSuggestions) {
                        suggestionP.onclick = this.setTrainNoSearchFieldValue;
                    }
                }
            }
        }

    setTrainNoSearchFieldValue = (event) => {
        this.trainNoSearchField.value = event.target.getAttribute('trainnumber');
        this.hideTrainNoSuggestionBox();
    }
    
    searchNo = async () => {
        const searchTextNo = this.trainNoSearchField.value.toLowerCase();
    
        if(searchTextNo.length > 0) {
            let trains = await this.requestTrains();

                let result = [];
                for(let trainData of trains) {
                    if(trainData.trainNo.toLowerCase() == searchTextNo) {
                            result.push(trainData);
                        }
                    }
                    if(result.length > 0) {
                            this.showResultBox();
                            this.putTrainsToTable(result);
                        } else {
                            this.showErrorMsg('Nincs találat!');
                        }
        } else {
            this.showErrorMsg('Üres keresési mező!');
        }
    }
}

const TrainsObj = new TrainSearch();