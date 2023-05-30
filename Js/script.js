
   
class Produto {
  constructor(nome, quantidade, preco) {
    this.nome = nome;
    this.quantidade = quantidade;
    this.preco = preco;
  }
}

class ControleEstoque {
  constructor() {
    this.produtos = [];
    this.exclusaoRecente = null;
  }

  adicionarProduto(nome, quantidade, preco) {
    const produto = new Produto(nome, quantidade, preco);
    this.produtos.push(produto);
    this.exibirProdutos();
    this.limparFormulario();
    this.salvarDados();
  }

  removerProduto(index) {
    this.exclusaoRecente = this.produtos.splice(index, 1)[0];
    this.exibirProdutos();
    this.habilitarDesfazer();
    this.salvarDados();
  }

  desfazerExclusao() {
    if (this.exclusaoRecente) {
      this.produtos.push(this.exclusaoRecente);
      this.exclusaoRecente = null;
      this.exibirProdutos();
      this.desabilitarDesfazer();
      this.salvarDados();
    }
  }

  exibirProdutos() {
    const tabela = document.getElementById("tabelaEstoque");
    tabela.innerHTML = `
      <tr>
        <th>Nome</th>
        <th>Quantidade</th>
        <th>Preço</th>
        <th class="alterar">Alterar</th>
        <th>Ações</th>
      </tr>
    `;

    this.produtos.forEach((produto, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${produto.nome}</td>
        <td>${produto.quantidade}</td>
        <td>R$ ${produto.preco}</td>
        <td><button class="alterar-button" onclick="controle.alterarProduto(${index})">Alterar</button></td>
        <td>
          <button onclick="controle.removerProduto(${index})">Remover</button>
        </td>
      `;
      tabela.appendChild(tr);
    });

    
  }



exibirProdutos() {
const tabela = document.getElementById("tabelaEstoque");
tabela.innerHTML = `
<tr>
  <th>Nome</th>
  <th>Quantidade</th>
  <th>Preço</th>
  <th class="alterar">Alterar</th>
  <th>Ações</th>
</tr>
`;

const produtosOrdenados = this.produtos.slice().sort((a, b) => a.nome.localeCompare(b.nome));

produtosOrdenados.forEach((produto, index) => {
const tr = document.createElement("tr");
tr.innerHTML = `
  <td>${produto.nome}</td>
  <td>${produto.quantidade}</td>
  <td>R$ ${produto.preco}</td>
  <td><button class="alterar-button" onclick="controle.alterarProduto(${index})">Alterar</button></td>
  <td>
    <button onclick="controle.removerProduto(${index})">Remover</button>
  </td>
`;
tabela.appendChild(tr);
});
}


  
  limparFormulario() {
    document.getElementById("nome").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("preco").value = "";
  }

  alterarProduto(index) {
    const produto = this.produtos[index];

    const formEdicao = document.createElement("form");
    formEdicao.innerHTML = `
      <label for="nomeEdicao">Nome do Produto:</label>
      <input type="text" id="nomeEdicao" value="${produto.nome}" required>

      <label for="quantidadeEdicao">Quantidade:</label>
      <input type="number" id="quantidadeEdicao" value="${produto.quantidade}" required>

      <label for="precoEdicao">Preço:</label>
      <input type="text" id="precoEdicao" value="${produto.preco}" required>

      <button type="button" onclick="controle.confirmarEdicao(${index})">Confirmar</button>
      <button type="button" onclick="controle.cancelarEdicao()">Cancelar</button>
    `;

    const tabela = document.getElementById("tabelaEstoque");
    const tr = tabela.rows[index + 1];
    tr.innerHTML = "";
    const td = tr.insertCell();
    td.colSpan = 5;
    td.appendChild(formEdicao);
  }

  confirmarEdicao(index) {
    const formEdicao = document.getElementById("tabelaEstoque").rows[index + 1].querySelector("form");
    const nome = formEdicao.querySelector("#nomeEdicao").value;
    const quantidade = parseInt(formEdicao.querySelector("#quantidadeEdicao").value);
    const preco = formEdicao.querySelector("#precoEdicao").value;

    if (nome && quantidade && preco) {
      const produto = new Produto(nome, quantidade, preco);
      this.produtos[index] = produto;
      this.exibirProdutos();
      this.salvarDados();
    }
  }

  cancelarEdicao() {
    this.exibirProdutos();
  }

  salvarDados() {
    localStorage.setItem("produtos", JSON.stringify(this.produtos));
  }

  carregarDados() {
    const produtosJSON = localStorage.getItem("produtos");
    if (produtosJSON) {
      this.produtos = JSON.parse(produtosJSON);
      this.exibirProdutos();
    }
  }

  habilitarDesfazer() {
    const desfazerButton = document.getElementById("desfazerButton");
    desfazerButton.disabled = false;
  }

  desabilitarDesfazer() {
    const desfazerButton = document.getElementById("desfazerButton");
    desfazerButton.disabled = true;
  }
}

const controle = new ControleEstoque();
controle.carregarDados();

document.getElementById("formProduto").addEventListener("submit", function(e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const preco = document.getElementById("preco").value;

  if (nome && quantidade && preco) {
    controle.adicionarProduto(nome, quantidade, preco);
  }
});

