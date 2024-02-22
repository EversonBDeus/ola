<template>
 
      <main class="table" id="customers_table">
        <section class="table__header">
            <h1 class="title">Registro de BA's</h1>
            <div class="input-group">
                <input type="search"  placeholder="Buscar..." v-model="searchText">
                <img src="../assets/images/search.png" alt="">
            </div>
            <div class="export__file">
                <label for="export-file" class="export__file-btn" title="Export File"></label>
                <input type="checkbox" id="export-file">
                <div class="export__file-options">
                    <label>Exportar como &nbsp; &#10140;</label>
                   
                    <label for="export-file" id="toEXCEL">EXCEL <img src="../assets/images/excel.png" alt=""></label>
                </div>
            </div>
        </section>
        <section class="table__body">
            <table>
                <thead>
                    <tr>
             
                        <th :class="{ 'active-th': activeColumn === 'id' }" @click="sortTable('id')"> ID <span class="icon-arrow">&UpArrow;</span></th>
<th > Nome </th>
<th :class="{ 'active-th': activeColumn === 'baUF' }" @click="sortTable('baUF')"> UF <span class="icon-arrow">&UpArrow;</span></th>
<th :class="{ 'active-th': activeColumn === 'baCentral' }" @click="sortTable('baCentral')"> Central <span class="icon-arrow">&UpArrow;</span></th>
<th :class="{ 'active-th': activeColumn === 'baNumber' }" @click="sortTable('baNumber')"> Número Ba <span class="icon-arrow">&UpArrow;</span></th>
<th :class="{ 'active-th': activeColumn === 'baStatus' }" @click="sortTable('baStatus')"> Status <span class="icon-arrow">&UpArrow;</span></th>
<th :class="{ 'active-th': activeColumn === 'date' }" @click="sortTable('date')"> Data <span class="icon-arrow">&UpArrow;</span></th>
<th > Açoes </th>
                    </tr>
                </thead>
                <tbody >
                    <tr   @change="updateBa(ba, ba.baNumber)" v-for="(ba, index) in store.bas" :key="ba.id" :class="{ hide: !shouldShowRow(ba) } "  :style="{ display: shouldShowRow(ba) ? 'table-row' : 'none' } "  >
                        <td > <strong>{{ index + 1 }}</strong> </td>
                        <td > <span class="name-img">A</span> <strong> Anonimo</strong></td>
                        <td> <input :class="{'input-table': true,'status-open': ba.baStatus === 'Aberto','status-cancelled': ba.baStatus === 'Cancelado'}" class="input-table" type="text" 
                        v-model="ba.baUF"  /></td>
                       
                        <td> <input    :class="{'input-table': true,'status-open': ba.baStatus === 'Aberto','status-cancelled': ba.baStatus === 'Cancelado'}" class="input-table" type="text" 
                        v-model="ba.baCentral"  /></td>
                        <td>
                            <input :class="{'input-table': true,'status-open': ba.baStatus === 'Aberto','status-cancelled': ba.baStatus === 'Cancelado'}" class="input-table" type="number" 
                            v-model="ba.baNumber" />

                        </td>

                        <td>
                            <select  @change="updateBa(ba, ba.baNumber)"  :class="ba.baStatus === 'Aberto' ? 'status open' : 'status cancelled'" v-model="ba.baStatus"  >
                                <option        :value="ba.baStatus === 'Aberto' ? 'Aberto' : 'Encerrado'">{{ ba.baStatus }}</option>
                                <option      :value="ba.baStatus === 'Aberto' ? 'Encerrado' : 'Aberto'">{{ ba.baStatus === 'Aberto' ? 'Encerrado' : 'Aberto' }}</option>
                                    </select>
                            
                        </td>
                        <td> {{ba.date}}   </td>
                        <td> 
                        

                            <li class="button-delete" @click="deleteBa(ba.id ? ba.id : '')"><img src="../assets//images//trash-bin-icon-flat-by-Vexels.png" alt="Excluir"></li>

                            
                           
                             </td>
                      
                       
                    </tr>
                   
                </tbody>
            </table>
        </section>
    </main>
</template>

<script  setup lang="ts">
import type { BasDados } from "@/interfaces/basdados"
import { useDadosStore } from '@/stores/state';

const searchText = ref('');


const active = ref(false);



const activeColumn = ref<string | null>(null);

function setActiveColumn(column: string) {
  activeColumn.value = activeColumn.value === column ? null : column;
}





const shouldShowRow = (ba: BasDados) => {
    const searchTerm = searchText.value.toLowerCase();

    return (
        ba.baUF.toLowerCase().includes(searchTerm) ||
        ba.baNumber.toString().includes(searchTerm) ||
        ba.baCentral.toLowerCase().includes(searchTerm) ||
        ba.baStatus.toLowerCase().includes(searchTerm)
    );
    
};



const sortDirection = ref<'asc' | 'desc'>('asc');

function sortTable(column: keyof BasDados) {
  const sortOrder = sortDirection.value === 'asc' ? 1 : -1;

  if (activeColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    // Adicione esta linha para remover a classe quando a coluna clicada já está ativa
    activeColumn.value = null;
  } else {
    activeColumn.value = column;
    sortDirection.value = 'asc';
  }

  store.bas.sort((a: BasDados, b: BasDados) => {
    const valueA = a[column] ?? '';
    const valueB = b[column] ?? '';

    return valueA > valueB ? sortOrder : -sortOrder;
  });
}


interface MyObject {
    searchText: string;
    $refs: {
        tableRow: HTMLElement[];
    };
}















const filteredBas = computed(() => {
    const searchTerm = searchText.value.toLowerCase();

    return store.bas.filter((ba: BasDados) =>
        ba.baUF.toLowerCase().includes(searchTerm) ||
        ba.baNumber.toString().includes(searchTerm) ||
        ba.baCentral.toString().includes(searchTerm) ||
        ba.baStatus.toLowerCase().includes(searchTerm)
    );
   
});

const store = useDadosStore();

function updateBa(ba: BasDados, baNumber: number) {
    const { id, baCentral, baStatus, date, baUF } = ba;
    onUpdateBa(id ?? 'default-id', baCentral, baNumber, baStatus, date, baUF);
    store.fetchBas();
}

async function onUpdateBa(id: string, baCentral: string, baNumber: number, baStatus: string, date: string, baUF: string) {
    await store.updateBa(id, baCentral, baNumber, baStatus, date, baUF);

}

function deleteBa(id: string) {
    fetch(`https://lai335y0ug.execute-api.sa-east-1.amazonaws.com/prod/bas/${id}`, {
        method: "DELETE",
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        console.log(response);
        store.fetchBas();
    })
    .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
    });
}




onMounted(() => {
    
    store.fetchBas();
});
</script>

<style >
.name-img{
    padding: 1rem 1rem 1rem 1rem;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color:rgba(0, 25, 247, 0.342) ;
    font-size: 25px;
    font-weight: 800;
    text-align: center;
    margin-right: .5rem;
    color: whitesmoke;
}
.title{
    color: rgb(70, 70, 255);
}
.button-delete{
    cursor: pointer;
}
li{
    list-style: none;
}
@keyframes pulseclosed {
    0% {
        transform: scale(1);
        border-color: #f00; /* Cor forte de vermelho */
    }
    50% {
        transform: scale(1.05);
        border-color: #f88; /* Cor intermediária */
    }
    100% {
        transform: scale(1);
        border-color: #f00; /* Cor forte de vermelho */
    }
}
@keyframes pulseopen {
    0% {
        transform: scale(1);
        border-color: rgb(0, 255, 0); /* Cor forte de vermelho */
    }
    50% {
        transform: scale(1.05);
        border-color: rgb(136, 255, 146); /* Cor intermediária */
    }
    100% {
        transform: scale(1);
        border-color: rgb(0, 255, 34); /* Cor forte de vermelho */
    }
}
.input-table{
    text-transform: uppercase;
    text-align: center;
    line-height: 1.5; /* Ajuste conforme necessário para centralizar verticalmente */
    font-size: 16px;
    font-weight: bold; 
    border-radius: .5rem;
    background-color: transparent;
    border: 1px solid transparent;
    padding: .4rem .4rem .4rem .4rem;
    transition: all 0.3s ease;
}
.input:hover{
    border: 2px solid red;
    transform: scale(1.00); /* Faz o input crescer em 5% */
    font-size: 1.2em;
    
 
}
.input-table:focus {
    border-color: #f00; /* Cor da borda quando o input está selecionado */
    outline: none; /* Remove a borda de foco padrão */
    transform: scale(1.00); /* Faz o input crescer em 5% */
    font-size: 1.2em;
    animation: pulseclosed 1s infinite; /* Aplica a animação de pulsação */
}
.input-table:hover {
    border-color: #f00; /* Cor da borda quando o input está selecionado */
    outline: none; /* Remove a borda de foco padrão */
    transform: scale(1.00); /* Faz o input crescer em 5% */
    font-size: 1.2em;
    animation: pulseclosed 1s infinite; /* Aplica a animação de pulsação */
}

.status-open:hover{
    animation: pulseopen 1s infinite; /* Aplica a animação de pulsação */
}

.status-open:focus{
    animation: pulseopen 1s infinite; /* Aplica a animação de pulsação */
}

.status-cancelled {
    border: 1px solid #ff0000; /* Cor da borda para status 'Cancelado' */
   
   
}

td:nth-child(3) input {
    width: 3rem;
    height: 2rem;
}

td:nth-child(4) input {
    width: 4rem;
    height: 2rem;
}

td:nth-child(5) input {
    width: 8rem;
    height: 2rem;
}


.menu li {
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.menu li:hover {
  background-color: #f1f1f1;
}

main.table {
    margin-top:5rem ;
    width: 72vw;
    height: 80vh;
    background-color: var(--header-input-bg-color);

    backdrop-filter: blur(7px);
    box-shadow: 0 .4rem .8rem #0005;
    border-radius: .8rem;

    overflow: hidden;
}

.table__header {
    width: 100%;
    height: 10%;
    background-color: var(--header-bg-color);
    padding: .8rem 1rem;

    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table__header .input-group {
    width: 35%;
    height: 100%;
    background-color: var(--header-input-bg-color);
    padding: 0 .8rem;
    border-radius: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: .2s;
}

.table__header .input-group:hover {
    width: 45%;
    background-color: var(--header-input-hover-bg-color);
    box-shadow: 0 .1rem .4rem #0002;
}

.table__header .input-group img {
    width: 1.2rem;
    height: 1.2rem;
}

.table__header .input-group input {
    width: 100%;
    padding: 0 .5rem 0 .3rem;
    background-color: transparent;
    border: none;
    outline: none;
}

.table__body {
    width: 95%;
   
    max-height: calc(89% - 1.6rem);
    background-color: var(--body-bg-color);

    margin: .8rem auto;
    border-radius: .6rem;

    overflow: auto;
    overflow: overlay;
}



.table__body::-webkit-scrollbar{
    width: 0.5rem;
    height: 0.5rem;
}

.table__body::-webkit-scrollbar-thumb{
    border-radius: .5rem;
    background-color: var(--scrollbar-thumb-color);
    visibility: hidden;
}

.table__body:hover::-webkit-scrollbar-thumb{ 
    visibility: visible;
}


table {
    width: 100%;
}

td img {
    width: 36px;
    height: 36px;
    margin-right: .5rem;
    border-radius: 50%;

    vertical-align: middle;
}

table, th, td {
    border-collapse: collapse;
    padding: 1rem;
    text-align: left;
}

thead th {
    position: sticky;
    top: 0;
    left: 0;
    background-color: var(--header-sticky-bg-color);
    cursor: pointer;
    text-transform: capitalize;
}

tbody tr:nth-child(even) {
    background-color: var(--scrollbar-thumb-color);
}


tbody tr {
    --delay: .1s;
    transition: .5s ease-in-out var(--delay), background-color 0s; /* Remova a transição da altura máxima */
    overflow: hidden; /* Esconda o conteúdo excedente */
}

tbody tr.hide {
    /* Remova a definição de max-height para não ter uma altura mínima */
    overflow: hidden; /* Esconda o conteúdo excedente */
    opacity: 0; /* Torna a linha completamente transparente */
    padding: 0; /* Remove o preenchimento para não ocupar espaço */
    transition: opacity 0.5s, padding 0s; /* Adicione a transição para a opacidade e preenchimento */
}





tbody tr:hover {
    background-color: var(--hovered-row-bg-color) !important;
}

tbody tr td,
tbody tr td p,
tbody tr td img {
    transition: .2s ease-in-out;
}

tbody tr.hide td,
tbody tr.hide td p {
    padding: 0;
    font: 0 / 0 sans-serif;
    transition: .2s ease-in-out .5s;
}

tbody tr.hide td img {
    width: 0;
    height: 0;
    transition: .2s ease-in-out .5s;
}

.status {
    padding: .4rem .5rem;
    border-radius: 2rem;
    text-align: center;
}

.status.open, .option.open{
    background-color: var(--open-status-bg-color);
    color: var(--open-status-text-color);
}
.status.open:hover, .option.open:hover{
    animation: pulseopen 1s infinite; /* Aplica a animação de pulsação */
}

.status.cancelled, .option.cancelled {
    background-color: var(--cancelled-status-bg-color);
    color: var(--cancelled-status-text-color);
   
}
.status.cancelled:hover, .option.cancelled:hover {
 
    animation: pulseclosed 1s infinite; /* Aplica a animação de pulsação */
}



.option.open {
    background-color: var(--open-status-bg-color);
    color: var(--open-status-text-color);
}

.option.cancelled {
    background-color: var(--cancelled-status-bg-color);
    color: var(--cancelled-status-text-color);
}

@media (max-width: 1000px) {
    td:not(:first-of-type) {
        min-width: 12.1rem;
    }
}

thead th span.icon-arrow {
    display: inline-block;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    border: 1.4px solid transparent;
    
    text-align: center;
    font-size: 1rem;
    
    margin-left: .5rem;
    transition: .2s ease-in-out;
}

thead th:hover span.icon-arrow{
    border: 1.4px solid var(--arrow-color);
}

thead th:hover {
    color: var(--arrow-color);
}

thead th.active-th span.icon-arrow{
    background-color:var(--arrow-color);
    color: var(--export-btn-hover-bg-color);
}
thead th.active-th span.icon-arrow{
    transform: rotate(180deg);
}



thead th.active,tbody td.active {
    color: var(--arrow-color);
}

.export__file {
    position: relative;
}

.export__file .export__file-btn {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: var(--export-btn-bg-color) url(../assets//images/export.png) center / 80% no-repeat;
    border-radius: 50%;
    transition: .2s ease-in-out;
}

.export__file .export__file-btn:hover { 
    background-color: var(--file-options-hover-bg-color);
    transform: scale(1.15);
    cursor: pointer;
}

.export__file input {
    display: none;
}

.export__file .export__file-options {
    position: absolute;
    right: 0;
    
    width: 12rem;
    border-radius: .5rem;
    overflow: hidden;
    text-align: center;

    opacity: 0;
    transform: scale(.8);
    transform-origin: top right;
    
    box-shadow: 0 .2rem .5rem var(--scrollbar-thumb-color);
    
    transition: .2s;
}

.export__file input:checked + .export__file-options {
    opacity: 1;
    transform: scale(1);
    z-index: 100;
}

.export__file .export__file-options label{
    display: block;
    width: 100%;
    padding: .6rem 0;
    background-color: var(--file-options-bg-color);
    
    display: flex;
    justify-content: space-around;
    align-items: center;

    transition: .2s ease-in-out;
}

.export__file .export__file-options label:first-of-type{
    padding: 1rem 0;
    background-color: var(--open-status-bg-color) !important;
}

.export__file .export__file-options label:hover{
    transform: scale(1.05);
    background-color: var(--file-options-hover-bg-color);
    cursor: pointer;
}

.export__file .export__file-options img{
    width: 2rem;
    height: auto;
}







</style>