import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    // try captura dos dados
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      // cadastrando novos usuarios e colocando todos os outros que ja tinha na const.
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      // catch captura dos erros
    } catch(error) {
      alert(error.message)
    }
  }

  delete(user){
    // Higher-order functions (map, filter, find, reduce)
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

// aqui alem de exportando estou extendendo a classe anterior para essa atual
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update(){
    this.removeAllTr()

    if (this.entries[0] == undefined) {
      this.isRowExist()
      return
    }

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`

      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esse Contato?')

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })

  }

  createRow() {
    const tr = document.createElement('tr')
    const content = `
      <td class="user">
        <img src="https://github.com/DhonatanJoseildo.png" alt="Imagem de Perfil">
        <a href="https://github.com/DhonatanJoseildo" target="_blank">
          <p>Dhonatan Joseildo</p>
          <span>DhonatanJoseildo</span>
        </a>
      </td>
      <td class="repositories">
        76
      </td>
      <td class="followers">
        9589
      </td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `
    tr.innerHTML = content
    return tr
  }

  removeAllTr() {
    

    this.tbody.querySelectorAll('tbody tr')
    .forEach((tr) => {
      tr.remove()
    })
  }

  isRowExist(){
    const tr = document.createElement('tr')
    tr.classList.add('notFav')
    const content = `
      <div class="notFavorites">
        <img src="./assets/Estrela.svg" alt="imagem de uma Estrela">
        <h1> Nenhum favorito ainda </h1>
      </div>
    `
    tr.innerHTML = content
    this.tbody.append(tr)
  }

}