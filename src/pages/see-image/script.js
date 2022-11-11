onload = () => {
    const data = JSON.parse(localStorage.getItem('result'));
    const resultDiv = document.getElementById('result');

    const resultExplanation = data.tem_tumor ? 'Foi possível detectar um tumor na mamografia enviada.' : 
    'Nenhum tumor foi detectado.';

    const img = ''

    resultDiv.innerHTML = `
        <div class="col">
            <img class="img" src="data:image/jpg;base64,${data.imagem_processada}" alt="">
        </div>
        <div class="col">
            <div>
                <h1>ID: </h1>
                <p>${data._id}</p>
            </div>
            <div>
                <h1>label: </h1>
                <p>${data.rotulo}</p>
            </div>
            <div>
                <h1>data de inclusao: </h1>
                <p>${new Date(data.data_envio)}</p>
            </div>
            <div>
                <h1>data de processamento: </h1>
                <p>${new Date(data.data_processamento)}</p>
            </div>
            <div>
                <h1>resultado: </h1>
                <p>${resultExplanation}</p>
            </div>
            <div>
                <img src="data:image/jpg;base64,${data.imagem}" style="height: 10em" alt="...">
            </div>
        </div>
    `
}