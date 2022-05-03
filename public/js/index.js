(function() {
    let baseJSON = null;
    let otherLanguageJSON = null;
    let differentKeys = [];
    let selectedLanguage = '';
    let resultJSON = {};

    const showAlert = (msg) => {
        const alert = document.getElementById('alertMsg');
        alert.innerHTML = msg;
        alert.classList.remove('hidden');
        setTimeout(function() {
            alert.classList.add('hidden');
            alert.innerHTML = '';
        }, 2000);
    }

    const getLabels = async (filename) => {
        try {
            const request = await fetch(`data/${filename}`);
            const json = await request.json();
            return json;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const checkKeys = (baseObj, testObj) => {
        const baseKeys = Object.keys(baseObj).sort();
        const testKeys = Object.keys(testObj).sort();

        for (const key of baseKeys) {
            if(!testKeys.includes(key)) {
                differentKeys.push(key);
            }else { continue; }
        }
        if(differentKeys.length > 0) {
            return differentKeys;
        }else{
            console.log("The BOTH JSON has the same keys");
        }
        

    }

    const handleCompareClick = async (value) => {
        if(differentKeys.length > 0) {
            differentKeys = [];
        }
        selectedLanguage = value;
        baseJSON = await getLabels('english.json');
        otherLanguageJSON = await getLabels(`${value}.json`);
        
        const keysDifferent = await checkKeys(baseJSON, otherLanguageJSON);
        renderResulsts(keysDifferent);
    }

    const handleGenerateClick = async () => {
        const translateTA = document.getElementById('translate-keys');
        if (baseJSON === null && otherLanguageJSON === null) {
            showAlert("Ocurrio un error, favor de recargar la página");
            return;
        }
        if (translateTA.value === '') {
            showAlert("Debes ingresar las claves traducidas");
            return;
        }
        let rows = translateTA.value.split('\n');
        for (let i = 0, length = rows.length; i < length; i++) {
            let fila = rows[i].split('.- '); // fila[0] = index, fila[1] = value
            resultJSON[differentKeys[i]] = {
                index: parseInt(fila[0]),
                value: fila[1]
            }
        }
        const resultsContainer = document.getElementById('results-container');
        const jsonContainer = document.getElementById('json-container');
        const jsonResult = document.getElementById('json-results');
        jsonResult.value = JSON.stringify(resultJSON, undefined, 4);
        resultsContainer.classList.add('hidden');
        jsonContainer.classList.remove('hidden');
    };

    const showKeysValue = (keys) => {
        const textArea = document.getElementById('missing-keys');
        if(textArea.innerHTML !== ""){
            textArea.innerHTML = "";
        }
        const keyList = Object.keys(otherLanguageJSON);
        console.log(keys);
        if(keyList.length !== 0){
            for(let i = 0, length = keys.length; i < length; i++) {
                textArea.value += `${otherLanguageJSON[keyList[keyList.length-1]].index + (i+1)}.- ${baseJSON[keys[i]].value}\n`
            }
        }else{
            for(let i = 0, length = keys.length; i < length; i++) {
                textArea.value += `${baseJSON[keys[i]].index}.- ${baseJSON[keys[i]].value}\n`
            }
        }
    };

    const handleJsonDownloadClick = async() => {
        const bodyRequest = { language: selectedLanguage, items: resultJSON };
        try {
            const response = await fetch('/api/getJSON', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyRequest)
            });
            const jsonData = await response.json();
            const divDownload = document.getElementById('json-file');
            let anchorFile = document.createElement('a');
            anchorFile.setAttribute('href', "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData)));
            anchorFile.setAttribute('download', `${selectedLanguage}.json`);
            divDownload.appendChild(anchorFile);
            anchorFile.click();
            anchorFile.remove();
        } catch (error) {
            console.log(error);
        }
        
    }

    const renderResulsts = (keys) => {
        const container = document.getElementById('keys-list');
        const resultsContainer = document.getElementById('results-container');
        const missingTA = document.getElementById('missing-keys');
        const translateTA = document.getElementById('translate-keys');
        const jsonContainer = document.getElementById('json-container');
        const jsonTA = document.getElementById('json-results');
        if(container.textContent !== "") {
            container.textContent = "";
        }
        if(missingTA.value !== "") { missingTA.value = ""; }
        if(translateTA.value !== "") {translateTA.value = "";}
        if(jsonTA.value !== "") {
            console.log(jsonTA.value);
            jsonTA.value = '';
            resultJSON = {};
            jsonContainer.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
        }
        const keysUl = document.createElement('ul');
        keysUl.classList.add('list-group', 'list-group-numbered');
        for(let i = 0, length = keys.length; i < length; i++) {
            const keysItem = document.createElement('li');
            keysItem.classList.add('list-group-item');
            const header = document.createElement('div');
            header.classList.add('fw-bold');
            header.innerHTML = `${keys[i]}`
            keysItem.innerHTML = `${baseJSON[keys[i]].value}`;
            keysItem.appendChild(header);
            keysUl.appendChild(keysItem);
        } 
        resultsContainer.classList.remove('hidden');
        container.appendChild(keysUl);
        showKeysValue(keys);
    };

    const initSelectAndButtons = () => {
        const selectContainer = document.getElementById('select-container')
        const selectList = document.createElement('select');
        selectList.id = "countries-list";
        selectList.name = "countries"
        selectList.classList.add('form-select');
        const countries = [
            'English', 'Arabic', 'Bulgarian', 'Chinese', 'Croatian', 'Czech', 'Danish', 'Dutch', 'Estonian', 'Finnish',
            'French', 'German', 'Hungarian', 'Italian', 'Latvian', 'Lithuanian', 'Norwegian', 'Polish', 'Portuguese',
            'Romanian', 'Russian', 'Serbian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Thai', 'Turkish', 'Ukrainian'
        ];
        for (let i = 0, length = countries.length; i < length; i++) {
            let option = document.createElement('option');
            option.value = countries[i];
            option.text = countries[i];
            selectList.appendChild(option);
        }
        selectContainer.appendChild(selectList);

        const compareBtn = document.getElementById('compare');
        compareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            handleCompareClick(selectList.value);
        })
        const genarateBtn = document.getElementById('generate');
        genarateBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            handleGenerateClick();
        })
        const downloadLink = document.getElementById('download-link');
        downloadLink.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            handleJsonDownloadClick();
        })
    }

    initSelectAndButtons();
})();