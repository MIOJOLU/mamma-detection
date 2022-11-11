const environment = 'http://44.198.5.220:8000/mamografias/';

onload = () => {
    visualization('ADD');
}


async function submitImage(body){
    const init = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        mode: 'cors',
        body: JSON.stringify(body)
    }
    const res = await fetch(`${environment}`, init)
        .then((response) => {
            return response.json();
         })
        .catch(error => console.log(error))
    document.getElementById('status').classList.remove('d-none');
    const spanId = document.getElementById('id-req');
    spanId.innerHTML = `
        <span>
            O id da sua mamografia é: <b>${res._id}</b>
        </span>
    `;
    localStorage.setItem('id', res.id)
}

function getImage(){
    document.getElementById('status').classList.add('d-none')
    const label = document.getElementById('label').value;
    const file = document.getElementById('file').files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const body = {
                "imagem": reader.result.split(',')[1],
                "rotulo": label
            }
            submitImage(body);
        }
        reader.onerror = () => {
            
        }
    }
}

async function findResults(){
    const label = document.getElementById('label-find').value;
    const init = {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
          },
        mode: 'cors'
    }
    const res = await fetch(`${environment}${label}`, init)
        .then(retorno => {
            return retorno.json();
         })
        .catch(error => console.log(error))

    if (res.classificado){
        localStorage.setItem('result', JSON.stringify(res));
        window.location.href = '../see-image/index.html'
    }else{
        document.getElementById('status-verify').classList.remove('d-none');
    }
}

function visualization(type){
    const doc = document.getElementById('forms');
    if (type === 'ADD'){
        doc.innerHTML = `
        <p class="text-justify">
        Utilizando a tecnologia para auxiliar na detecção de tumores em mamas.
        Caso já possua um mamografia e deseja enviar-nos para detecção.
    </p>
    <form>
        <div class="mb-2">
          <label for="exampleInputEmail1" class="form-label">Nome</label>
          <input type="text" class="form-control form-control-sm" id="label" >
        </div>
        <div class="mb-2">
          <label for="exampleInputPassword1" class="form-label">Arquivo</label>
          <input type="file" class="form-control form-control-sm" id="file">
        </div>
        <div class="d-grid status">
            <button 
                class="btn btn-primary btn-sm" 
                type="button"
                onclick="getImage()"
                >Enviar
                </button>
                <p class="d-none" id="status">
                    <i class="fa-solid fa-check"></i>
                    Enviada com sucesso. 
                </p>
                <p id="id-req"></p>
            </div>
        <p class="mt-3" style="font-size: 12px">
            Gostaria de consultar os resultados? 
            <button type="button" 
            class="btn btn-link btn-sm m-0 p-0 text-decoration-none " 
            onclick="visualization('VISUALIZATION')">
                Acessar resultados
            </button>
        </p>
    </form>
        `
    }else{
        doc.innerHTML = `
        <p class="mt-3 text-justify">
        Caso possua uma imagem e queira ver o resultado:
    </p>
    <form>
        <div class="mb-2">
            <label for="exampleInputEmail1" class="form-label">ID</label>
            <input type="text" class="form-control form-control-sm" id="label-find" >
        </div>
        <div class="d-grid">
            <button 
            class="btn btn-primary btn-sm" 
            type="button"
            onclick="findResults()"
            >Enviar
            </button>
        </div>

        <p class="mt-3" style="font-size: 12px">
            Ainda não enviou sua mamografia?
            <button type="button" 
            class="btn btn-link btn-sm m-0 p-0 text-decoration-none " 
            onclick="visualization('ADD')">
                Enviar agora
            </button>
        </p>

        <p class="d-none" id="status-verify">
                    <i class="fa-solid fa-clock"></i>
                    Mamografia ainda está sendo processada... Tente novamente mais tarde.
        </p>
    </form>
        `
    }
}