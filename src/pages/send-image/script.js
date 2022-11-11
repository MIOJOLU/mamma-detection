const environment = 'http://44.198.5.220:8000/mamografias/';

onload = () => {
    visualization('ADD');
}
let submited = false;


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
    submited = true;
    document.getElementById('status').classList.add('d-none')
    const label = document.getElementById('label').value;
    const file = document.getElementById('file').files[0];
    if (!label){
        document.getElementById('validation-label').classList.remove('d-none');
    }
    if (!file){
        document.getElementById('validation-file').classList.remove('d-none');
    }else if (file) {
            if (file.type === 'image/jpeg'){
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const body = {
                    "imagem": reader.result.split(',')[1],
                    "rotulo": label
                }
                submited = false;
                //submitImage(body);
            }
            reader.onerror = () => {
                
            }
        }else{
            document.getElementById('validation-file').classList.remove('d-none');
        }
    }
}

async function findResults(){
    submited = true;
    const label = document.getElementById('label-find').value;
    if (label !== ''){
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
            .catch(error => {
                if (error){
                    document.getElementById('validation-id').classList.add('d-none');
                }
            })
    
        if (res){
            if (res.classificado){
                localStorage.setItem('result', JSON.stringify(res));
                window.location.href = '../see-image/index.html'
            }else{
                document.getElementById('status-verify').classList.remove('d-none');
            }
        }
    }else{
        document.getElementById('validation-id').classList.remove('d-none');
    }
}

function checkValidation(type){
    if (type === 'ADD'){
        const label = document.getElementById('label').value;
        const file = document.getElementById('file').files[0];
        if (submited){
            if (label){
                document.getElementById('validation-label').classList.add('d-none');
            }
            if (file && file.type === 'image/jpeg'){
                document.getElementById('validation-file').classList.add('d-none');
            }
        }
    }else{
        const id = document.getElementById('label-find').value;
        if (submited && id !== ''){
            document.getElementById('validation-id').classList.add('d-none');
        }
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
          <input 
            type="text" 
            class="form-control 
            form-control-sm" 
            id="label"
            onchange="checkValidation('ADD')" >
          <div class="d-none invalid" id="validation-label">
            É necessário adicionar um nome.
        </div>
        </div>
        <div class="mb-2">
          <label for="exampleInputPassword1" class="form-label">Arquivo</label>
          <input 
          type="file" 
          class="form-control 
          form-control-sm" 
          onchange="checkValidation('ADD')"
          id="file">
          <div class="d-none invalid" id="validation-file">
            É necessário adicionar um arquivo do tipo JPEG ou JPG.
        </div>
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
            <input 
                onchange= "checkValidation('EDIT')"
                type="text" 
                class="form-control form-control-sm" 
                id="label-find" >
            <div class="d-none invalid" id="validation-id">
            É necessário adicionar um ID válido.
        </div>
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