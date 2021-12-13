let controle_cap = true, controle_res = true, controle_ind = true;



var qntress = 0, qntresp = 0, qntcapp = 0, qntcaps = 0, qntinds = 0, qntindp = 0, req = 0, pot = 0, ddp = 0, potd = 0, cap = 0, ceq = 0, ceqs = 0, enc = 0, indut = 0, tensi = 0, eni = 0;
var ctrlr = 1, ctrlp = 1, ctrli = 0;

//Funçoes description == Mostram a descriçao de cada componente quando mouse fica sobreposto, Remove_Description = Remove descriçao quando mouse sai
function Description_Cap() {
    if (controle_cap == true) {
        var cap = document.getElementById('capacitor_div');
        var desc_cap = '<h3>\
     Esse é um capacitor! Ele tem por finalidade armazenar cargas elétricas em sua composição através de um acumulo de cargas.\
    </h3>'
        cap.innerHTML = desc_cap;
    }
}
function Remove_Description_Cap() {
    var cap = document.getElementById('capacitor_div');
    var desc_cap = '';
    cap.innerHTML = desc_cap;
}

function Description_Res() {
    if (controle_res == true) {
        var res = document.getElementById('resistor_div');
        var desc_res = '<h3>\
     Esse é um resistor! Eles são componentes que tem por função limitar o fluxo de cargas elétricas por meio da conversão da energia elétrica em energia térmica, ou seja, calor.\
    </h3>'
        res.innerHTML = desc_res;
    }
}

function Remove_Description_Res() {
    var res = document.getElementById('resistor_div');
    var desc_res = '';
    res.innerHTML = desc_res;
}

function Description_Indut() {
    if (controle_ind == true) {
        var indut = document.getElementById('indutor_div');
        var desc_indut = '<h3>\
     Esse é um indutor! Eles são constituídos por fios enrolados sobre um núcleo e possuem a capacidade de armazenar energia com a criação de um campo magnético.\
    </h3>'
        indut.innerHTML = desc_indut;
    }
}

function Remove_Description_Indut() {
    var indut = document.getElementById('indutor_div');
    var desc_indut = '';
    indut.innerHTML = desc_indut;
}

//dragstart funciona como o inicio do drag, quando pega o item, declarado somente como copia
function dragstart_handler(ev) {
    console.log("dragStart");
    ev.currentTarget.style.border = "dashed";
    ev.dataTransfer.setData("image", ev.target.id);
    ev.effectAllowed = "copy";
}
//quanto o item puxado fica em cima da area drop
function dragover_handler(ev) {
    console.log("dragOver");
    ev.currentTarget.style.background = "lightgreen";
    ev.preventDefault();
}
//quando o item é dropado, nessa funçao é reconhecido e contabilizado para os calculos. Clonagem dos itens tambem ocorre aqui
function drop_handler(ev) {
    console.log("Drop");
    ev.preventDefault();
    var id = ev.dataTransfer.getData("image");
    if (id == "img_capacitor") {
        var nodeCopy = document.getElementById(id).cloneNode(true);
        nodeCopy.id = "newId";
        ev.target.appendChild(nodeCopy);

        if (ev.target.id == "Drop_Componente_Paralelo1" || ev.target.id == "Drop_Componente_Paralelo2" || ev.target.id == "Drop_Componente_Paralelo3" || ev.target.id == "Drop_Componente_Paralelo4")
            qntcapp++;


        if (ev.target.id == "Drop_Componente_Serie1" || ev.target.id == "Drop_Componente_Serie2")
            qntcaps++;
    }
    if (id == "img_resistor") {
        var nodeCopy = document.getElementById(id).cloneNode(true);
        nodeCopy.id = "newId";
        ev.target.appendChild(nodeCopy);

        if (ev.target.id == "Drop_Componente_Paralelo1" || ev.target.id == "Drop_Componente_Paralelo2" || ev.target.id == "Drop_Componente_Paralelo3" || ev.target.id == "Drop_Componente_Paralelo4")
            qntresp++;


        if (ev.target.id == "Drop_Componente_Serie1" || ev.target.id == "Drop_Componente_Serie2")
            qntress++;
    }
    if (id == "img_indutor") {
        var nodeCopy = document.getElementById(id).cloneNode(true);
        nodeCopy.id = "newId";
        ev.target.appendChild(nodeCopy);

        if (ev.target.id == "Drop_Componente_Paralelo1" || ev.target.id == "Drop_Componente_Paralelo2" || ev.target.id == "Drop_Componente_Paralelo3" || ev.target.id == "Drop_Componente_Paralelo4")
            qntindp++;


        if (ev.target.id == "Drop_Componente_Serie1" || ev.target.id == "Drop_Componente_Serie2")
            qntinds++;
    }

}
//reformataçao dos itens
function dragend_handler(ev) {
    console.log("dragEnd");
    ev.target.style.border = "solid black";
    ev.dataTransfer.clearData();
}

function Recarrega() {
    window.location.href = window.location.pathname + window.location.search + window.location.hash;
}



//PARTE DE CALCULOS



//CONSIDERAR U = R.I, P = I.U, POTD = R.I^2, RESISTORES EM PARALELO E SERIE;
//CAPACITORES PARALELO E SERIE,Q = C.V E En=1/2.Q.V, PARA INDUTORES, CONSIDERAR DELTAT = 1;
//ESPIRAS COM 1 CM DE AREA E 2 ESPIRAS E PERMEABILIDADE MAGNETICA NO VACUO DE 4*PI*10^-7 H/m

function circuito() {

    if (qntresp == 1 && qntcapp == 0 && qntindp == 0) {
        qntresp = 0;
        qntress++;
    }

    if (qntcapp == 1 && qntresp == 0 && qntindp == 0) {
        qntcapp = 0;
        qntcaps++;
    }

    if (qntindp == 1 && qntresp == 0 && qntcapp == 0) {
        qntindp = 0;
        qntinds++;
    }

    limpar_canvas();
    resistores();
    capacitores();
    indutores();
    canvas();

}

function resistores() {

    if (qntresp > 1)
        for (ctrl = 0; ctrl < qntresp; ctrl++)
            ctrlr = ctrlr + 1;

    req = (100 * qntress) + (ctrlr / 100);     //REQ = R * n -- serie e paralelo
    ddp = req * 0.2;                         //U = R.I
    pot = 0.2 * ddp;                           //POTENCIA
    potd = req * 0.04;                       //POTENCIA DISSIPADA   
    //------------------------ Resistores -------------------------
}

function capacitores() {

    if (qntcaps > 1)
        for (ctrl = 0; ctrl < qntcaps; ctrl++)
            ctrlp = ctrlp + 1;

    cap = 0.1 / 6;                     //CAPACITANCIA = Q/V
    ceqs = cap / ctrlp;                  //Capacitores em serie
    ceq = (cap * qntcapp) + ceqs;      //ASSOCIACAO EM PARALELO E SERIE
    enc = (ceq * 12) / 2;              //ENERGIA ACUMULADA
    //----------------------- Capacitores -------------------------
}

function indutores() {

    if (qntindp > 1)
        for (ctrl = 0; ctrl < qntindp; ctrl++)
            ctrli = ctrli + 1;

    indut = 16 * 3.14 * 0.01;            //INDUTANCIA
    tensi = -indut * (0.2 / 1);               //TENSAO INDUZIDA
    eni = (indut * 0.04) / 2;                 //ENERGIA ARMAZENADA NO INDUTOR
    ieqp = indut / ctrli;                    //Indutancia em paralelo
    ieq = (indut * qntinds) + ieqp;          //INDUTORES EM SERIE E PARALELO
    //---------------------- Indutores ----------------------------
}

function canvas() {

    var ceqa = parseFloat(ceq.toFixed(7));
    var tensia = parseFloat(tensi.toFixed(7));
    var enia = parseFloat(eni.toFixed(7));
    var reqa = parseFloat(req.toFixed(7));
    var ddpa = parseFloat(ddp.toFixed(7));              //Arredondamento com 7 casas decimais
    var pota = parseFloat(pot.toFixed(7));
    var potda = parseFloat(potd.toFixed(7));
    var enca = parseFloat(enc.toFixed(7));
    var ieqa = parseFloat(ieq.toFixed(7));

    var pulo = 20;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.font = "13px 'Times New Roman'";
    if (qntress != 0 || qntresp != 0) {
        ctx.fillText("Resistência Equivalente = " + reqa + " Ohms", 10, pulo); pulo += 12;
        ctx.fillText("Diferença de Potencial = " + ddpa + " Volts", 10, pulo); pulo += 12;
        ctx.fillText("Potência = " + pota + " Watts", 10, pulo); pulo += 12;
        ctx.fillText("Potência Dissipada = " + potda + " Watts", 10, pulo); pulo += 12;
    }                       //escrita do canvas
    if (qntcaps != 0 || qntcapp != 0) {
        ctx.fillText("Capacitância Equivalente = " + ceqa + " Farad", 10, pulo); pulo += 12;
        ctx.fillText("Energia Acumulada no Capacitor = " + enca + " Joules", 10, pulo); pulo += 12;
    }
    if (qntinds != 0 || qntindp != 0) {
        ctx.fillText("Tensão nos indutores = " + tensia + " Volts", 10, pulo); pulo += 12;
        ctx.fillText("Energia Acumulada no Indutor = " + enia + " Joules", 10, pulo); pulo += 12;
        ctx.fillText("Indutância Equivalente = " + ieqa + " Henri", 10, pulo);
    }
}

function limpar_canvas() {
    var c = document.getElementById("myCanvas");            //apagar canvas para nova reescrita
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 500, 300);
}
