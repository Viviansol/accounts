const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
operation()

function operation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Criar conta',
          'Consultar Saldo',
          'Depositar',
          'Sacar',
          'Sair',
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action']
        if(action === "Criar conta"){
            createAccount();
            buildAccount();
        }else if(action === "Depositar"){
            deposit();
        }else if(action === "Sacar"){
            withdraw()
        }else if(action === "Consultar Saldo"){
            getAccountBalance()
        }else if(action === "Sair"){
            console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"))
            process.exit();
        }

    })
}


function createAccount(){

console.log(chalk.bgGreen.black("parabéns por escolher nosso banco"));
console.log(chalk.green('Defina as opções da sua conta a seguir'));

}

function buildAccount(){
inquirer.prompt([{
    name : 'accountName',
    message: 'Digite um nome para a sua conta:'
}]).then((answer)=>{
    const accountName = answer['accountName']
    console.info(accountName)
    if(!fs.existsSync('accounts')){
        fs.mkdirSync('accounts')
    }

    if(fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black("esta conta já existe, escolha outro nome!"))
        buildAccount()
        return
    }
    fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err){ console.log(err)})
    
    console.log(chalk.green("Parabéns, a sua conta foi criada"))

    operation();

})
.catch((err)=> console.log(err))

}

function deposit(){

    inquirer.prompt([
        {
        name: 'accountName',
        message: "Qual  o nome da sua conta?"
    }
])
.then((answer)=>{
    const accountName = answer['accountName']
    if(!checkAccount(accountName)){

        return deposit();

    }
    inquirer.prompt([
        {
            name:'amount',
            message: "Quanto você deseja depositar?"
        }
    ]).then(answer=>{
        const amount = answer['amount']
        addAmount(accountName, amount);

        operation();
    })
    .catch((err)=> console.log(err))
    
})
.catch((err) => console.log(err))

}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black("esta conta não existe, tente novamente"))
        return false
    }
    return true
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName);

    if(!amount){
    console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!"))
    return deposit()
    }

    accountData.balance = parseFloat(amount)+parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(accountData),
        function(err){
        console.log(err)
     },
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
    
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        enconding: 'utf-8', 
        flag: 'r'
    })

    return JSON.parse(accountJSON);

}

function getAccountBalance(){

    inquirer.prompt([{
        name:'accountName',
        message: "qual o nome  da sua conta?"
    }]).then((answer) =>{
        const accountName= answer["accountName"]
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }
        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R4${accountData.balance}`))
        operation()
    }).catch((err) => console.log(err))

}

function withdraw() {
    inquirer
      .prompt([
        {
          name: 'accountName',
          message: 'Qual o nome da sua conta?',
        },
      ])
      .then((answer) => {
        const accountName = answer['accountName']
  
        if (!checkAccount(accountName)) {
          return withdraw()
        }
  
        inquirer
          .prompt([
            {
              name: 'amount',
              message: 'Quanto você deseja sacar?',
            },
          ])
          .then((answer) => {
            const amount = answer['amount']
  
            removeAmount(accountName, amount)
            operation()
          })
      })
  }

  function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)
  
    if (!amount) {
      console.log(
        chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),
      )
      return withdraw()
    }
  
    if (accountData.balance < amount) {
      console.log(chalk.bgRed.black('Valor indisponível!'))
      return withdraw()
    }
  
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
  
    fs.writeFileSync(
      `accounts/${accountName}.json`,
      JSON.stringify(accountData),
      function (err) {
        console.log(err)
      },
    )
  
    console.log(
      chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`),
    )
  }