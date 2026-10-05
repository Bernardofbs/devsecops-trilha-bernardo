# Onboarding SACI 2026.2 - DevSecOps

## Dados do Candidato
* **Nome:** Bernardo Ferreira Barbosa Silva
* **Curso:** Sistemas para Internet
* **Trilha:** DevSecOps

---

## Desafio Técnico Inicial

### Pergunta:
Trilha: DevSecOps
Pergunta Rápida: Escreva uma breve explicação (COM SUAS PALAVRAS) sobre o que são SAST, DAST, SCA e como cada um deles ajuda no desenvolvimento seguro.

### Resposta:

Sast (Static Application Security Testing):  

Uma análise estática do código. O código não será rodado enquanto a análise ocorre. Um exemplo disso é quando nós fazemos um pull de um código no git hub, o que já encaixa na outra propriedade, que é o acesso ao código fonte. Sua execução ocorre de maneira rápida e ainda pode ser feita por meio de plugins na própria IDE de desenvolvimento, enquanto o código está sendo produzido, obtendo um feedback se o código está vulnerável ou não. 

Exemplo de ferramenta Sast: Bandit, usada para python. 

Dast (Dynamic Application Security Testing):  

Diferente do Sast, essa análise é dinâmica. Não acontece o acesso ao código fonte, pois ela recebe apenas uma URL, por isso sua execução é mais lenta, pois ela acessa a URL em busca de formulários de requisição e suas respostas, procurando por brechas de segurança. 

Exemplo de ferramenta: OWASP ZAP, uma ferramenta open source. 

SCA (Software Composition Analysis): 

Uma ferramenta que analisa as dependências de um projeto/arquivo e sua composição. Após isso, procura em um banco de dados as vulnerabilidades já reportadas e traz feedbacks que já ocorreram com uma biblioteca ou outra composição do código, por exemplo. Pode sugerir correções de segurança, como atualizações para versões mais protegidas. 

Exemplo de ferramenta: Yarn Audit: (Javascript).