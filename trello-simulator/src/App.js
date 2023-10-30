import { Modal, ProgressBar } from 'react-bootstrap';
import './App.css';
import React, { useState, useEffect } from 'react';

export function App() {
  const [nrCards, setNrCards] = useState(0);
  const [dadosCardIniciar, setDadosCardIniciar] = useState([]);
  const [dadosCardDesenvolvimento, setDadosCardDesenvolvimento] = useState([]);
  const [dadosCardTeste, setDadosCardTeste] = useState([]);
  const [dadosCardFinalizado, setDadosCardFinalizado] = useState([]);
  const [mostraModalAddTarefa, setMostraModalAddTarefa] = useState(false);
  const [mostraModalInformacoes, setMostraModalInformacoes] = useState(false);
  const [nrCardsExcluidos, setNrCardsExcluidos] = useState(0);
  const [textoMsg, setTextoMsg] = useState("");
  const [showMsgInformativa, setShowMsgInformativa] = useState(false);
  const [progresso, setProgresso] = useState(0);
  
  // useEffect(() => {
  //   let timer;
  //   if (showMsgInformativa) {
  //     timer = setInterval(() => {
  //       setProgresso((prevProgresso) => prevProgresso + 20);
  //     }, 500);
  //   }
  //   return () => {
  //     clearInterval(timer);
  //     setProgresso(0);
  //   };
  // }, [showMsgInformativa]);

  // useEffect(() => {
  //   if (progresso >= 100) {
  //     setShowMsgInformativa(false);
  //     setProgresso(0);
  //   }
  // }, [progresso]);
  
  function addNovaTarefa(dadoCard) {
    const newCard = {
      ...dadoCard,
      id: nrCards
    }
    setNrCards(nrCards+1);
    setDadosCardIniciar(value => [...value, newCard]);
    setMostraModalAddTarefa(false);
    setTextoMsg("Novo card " + dadoCard.titulo + " foi adicionado na coluna (Aguardando)." );
    setShowMsgInformativa(true);
  }

  function MontaCard({id, titulo, descricao, prioridade, nomeColuna, data}){
    return(
      <div className='card-tarefa' key={id}>
        <div className='opcoes-card'>
          <div className='col-4'>
            {nomeColuna !== "aguardando" &&
              <TipoBtnCardVoltar idCard={id} colName={nomeColuna}/>
            }
          </div>
          <div className='col-4' style={{justifyContent:"center", display:"flex"}}>
            <div className='prioridade-card' style={{backgroundColor:corPrioridade(prioridade)}}> </div>
          </div>
          <div className='col-4'>
            <TipoBtnCard idCard={id} colName={nomeColuna}/>
          </div>
        </div>
          <h4>{id}-{titulo}</h4>
        <div style={{textAlign:"end", paddingRight: ".3rem"}}>
          <p style={{marginBottom:"0px", fontSize:".7rem"}}>Data de entrega: {data}</p>
        </div>
        <hr style={{margin: ".2rem"}}/>
        <div className='descricao-card'>
          <p>{primeiraLetraMaiuscula(descricao)}</p>
        </div>
      </div>
    )
  }

  function TipoBtnCard({idCard, colName}){
    switch (colName) {
      case 'aguardando':
        return (
        <button className='btn btn-acoes-card' onClick={() => 
          moveCard(idCard, dadosCardIniciar, setDadosCardIniciar, setDadosCardDesenvolvimento)
        }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
          </svg>
        </button>)
      case 'desenvolvendo':
        return (<button className='btn btn-acoes-card' onClick={() => 
          moveCard(idCard, dadosCardDesenvolvimento, setDadosCardDesenvolvimento, setDadosCardTeste)
        }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
          </svg>
        </button>)
      case 'teste':
        return (<button className='btn btn-acoes-card' onClick={() => 
          moveCard(idCard, dadosCardTeste, setDadosCardTeste, setDadosCardFinalizado)
        }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
          </svg>
        </button>)
      case 'finalizado':
        return (<button className='btn btn-acoes-card-deletar' onClick={() => 
          excluirCardFinalizado(idCard)
        }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>
        </button>)
    
      default:
        break;
    }
  }

  function TipoBtnCardVoltar({idCard, colName}){
    switch (colName) {
      case 'desenvolvendo':
        return (<button className='btn btn-acoes-card' onClick={() => 
          moveCard(idCard, dadosCardDesenvolvimento, setDadosCardDesenvolvimento, setDadosCardIniciar)
        }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
          </svg>
        </button>)
      case 'teste':
        return (<button className='btn btn-acoes-card' onClick={() => 
          moveCard(idCard, dadosCardTeste, setDadosCardTeste, setDadosCardDesenvolvimento)
        }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
          </svg>
        </button>)
      case 'finalizado':
        return (<button className='btn btn-acoes-card' onClick={() => 
          moveCard(idCard, dadosCardFinalizado, setDadosCardFinalizado, setDadosCardTeste)
        }>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
          </svg>
        </button>)
    
      default:
        break;
    }
  }
  
  //Move os cards entre as colunas
  function moveCard(id, sourceArray, setSource, setTarget) {
    const dadosCard = sourceArray.filter((item) => item.id === id);
    setTarget((valuesOld) => [...valuesOld, ...dadosCard]);
    const cardRemovido = sourceArray.filter((item) => item.id !== id);
    setSource([...cardRemovido]);
    setTextoMsg("Card " + dadosCard.titulo + " foi movido para sua nova coluna com sucesso." );
    setShowMsgInformativa(true);
  }

  function excluirCardFinalizado(id){
    // filtra removendo o item que foi movido para teste
    const dadosCardRemovido = dadosCardFinalizado.filter((item) => item.id === id)
    const cardRemovido = dadosCardFinalizado.filter((item) => item.id !== id)
    setDadosCardFinalizado([...cardRemovido]);
    setNrCardsExcluidos(nrCardsExcluidos+1);
    setTextoMsg("Card " + dadosCardRemovido.titulo + " foi removido com sucesso." );
    setShowMsgInformativa(true);
  }

  function primeiraLetraMaiuscula(texto) {
    if (texto.length === 0) {
      return texto;
    } else {
        const primeiraLetra = texto.charAt(0).toUpperCase();
        const restoDaString = texto.slice(1);
        const newText = primeiraLetra + restoDaString;
        return newText;
    }
  }
  
  function corPrioridade(tipoPrioridade) {
    switch (tipoPrioridade) {
      case "alta":
        return "red"
      case "media":
        return "orange"
      case "baixa":
        return "green"
      default:
        break;
    }
  }

  function ModalNovaTarefa() {
    const [dadosCard, setDadosCard] = useState({titulo:"", descricao: "", prioridade: ""});
    const handleCampos = (campo = "titulo" | "descricao" | "prioridade" | "data", valor) => {
      
      if (campo === "titulo"){
        setDadosCard({
          ...dadosCard,
          titulo: valor
        })
      }else if( campo === "descricao"){
        setDadosCard({
          ...dadosCard,
          descricao: valor
        })
      }else if (campo === "prioridade") {
        setDadosCard({
          ...dadosCard,
          prioridade: valor
        })
      }else if (campo === "data") {
        setDadosCard({
          ...dadosCard,
          data: valor
        })
      }
    }
    return(
      <Modal show={mostraModalAddTarefa} centered onHide={() => setMostraModalAddTarefa(false)}>
        <Modal.Header closeButton className='header-modal-adicionar'>
          <Modal.Title>
            Adicionar Tarefa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='body-modal-adicionar'>
          <div className='campo-inputs'>
            <label>Título</label>
            <input onChange={(e) => handleCampos("titulo", e.target.value)} placeholder='título'/>
          </div>
          <div className='campo-inputs'>
            <label>Descrição</label>
            <textarea onChange={(e) => handleCampos("descricao", e.target.value)} placeholder='Descrição'/>
          </div>
          <div className='campo-inputs'>
            <label>Data de entrega</label>
            <input type='date' onChange={(e) => handleCampos("data", e.target.value)} />
          </div>
          <div className='campo-inputs'>
            <label>Nível de prioridade</label>
            <select onChange={(e) => handleCampos("prioridade", e.target.value)}>
              <option value=''>Selecione...</option>
              <option value='alta'>Alta</option>
              <option value='media'>Médio</option>
              <option value='baixa'>Baixo</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer className='footer-modal-adicionar'>
          <button className='btn btn-danger' onClick={() => setMostraModalAddTarefa(false)}>Cancelar</button>
          <button className='btn btn-success' onClick={() => addNovaTarefa(dadosCard)}>Adicionar</button>
        </Modal.Footer>
      </Modal>
    )
  }

  function TipoProgressBar({porcentagem}){
    if (porcentagem < 50){
      return (
        <div className="progress">
          <div className="progress-bar bg-info" role="progressbar" style={{width:porcentagem+"%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            {porcentagem}%
          </div>
        </div>
      )
    } else if (porcentagem < 70) {
      return (
        <div className="progress">
          <div className="progress-bar bg-warning" role="progressbar" style={{width:porcentagem+"%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            {porcentagem}%
          </div>
        </div>
      )
    } else {
      return (
        <div className="progress">
          <div className="progress-bar bg-danger" role="progressbar" style={{width:porcentagem+"%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            {porcentagem}%
          </div>
        </div>
      )
    }
  }

  function porcentagemPorColuna(colName){
    if (nrCards > 0){
      switch (colName) {
        case "aguardando":
          return (100 / (nrCards - nrCardsExcluidos) ) * dadosCardIniciar.length
           
        case "desenvolvendo":
          return (100 / (nrCards - nrCardsExcluidos) ) * dadosCardDesenvolvimento.length; 
  
        case "teste":
          return (100 / (nrCards - nrCardsExcluidos) ) * dadosCardTeste.length; 
        
        case "finalizado":
          return (100 / (nrCards - nrCardsExcluidos) ) * dadosCardFinalizado.length; 
        
        case "excluido":
          return (100 / nrCards) * nrCardsExcluidos; 
        default:
          break;
      }
    } else{
      return 0
    }
  }

  function ModalInformacoes(){
    return(
      <Modal show={mostraModalInformacoes} size='xl' centered onHide={() => setMostraModalInformacoes(false)}>
        <Modal.Header closeButton className='header-modal-adicionar'>
          <Modal.Title>
            Informações
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='body-modal-adicionar'>

          <div style={{marginTop:".5rem"}}>
            <label>Cards na coluna aguardando</label>
            <TipoProgressBar porcentagem={porcentagemPorColuna("aguardando")}/>
          </div>

          <div style={{marginTop:".5rem"}}>
            <label>Cards na coluna desenvolvimento</label>
            <TipoProgressBar porcentagem={porcentagemPorColuna("desenvolvendo")}/>
          </div>

          <div style={{marginTop:".5rem"}}>
            <label>Cards na coluna de teste</label>
            <TipoProgressBar porcentagem={porcentagemPorColuna("teste")}/>
          </div>

          <div style={{marginTop:".5rem"}}>
            <label>Cards na coluna finalizado</label>
            <TipoProgressBar porcentagem={porcentagemPorColuna("finalizado")}/>
          </div>

          <div style={{marginTop:".5rem"}}>
            <label>Cards excluídos</label>
            <TipoProgressBar porcentagem={porcentagemPorColuna("excluido")}/>
          </div>

          <hr/>

          <div style={{display:"flex"}}>
            <div style={{width:"50%"}}>
              <label>Total de Cards(Incluso excluídos)</label>
              <p>{nrCards+nrCardsExcluidos}</p>
            </div>
            <div style={{width:"50%"}}>
              <label>Cards Excluídos</label>
              <p>{nrCardsExcluidos}</p>
            </div>
          </div>

          <hr/>

          <div>
            <label>Descrição das cores dos card</label>
            <div style={{fontSize:".7rem"}}>
              Baixa prioridade
              <div className='prioridade-card' style={{backgroundColor:corPrioridade("baixa")}}> </div>
            </div>
            <div style={{fontSize:".7rem"}}>
              Média prioridade
              <div className='prioridade-card' style={{backgroundColor:corPrioridade("media")}}> </div>
            </div>
            <div style={{fontSize:".7rem"}}>
              Alta prioridade
              <div className='prioridade-card' style={{backgroundColor:corPrioridade("alta")}}> </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='footer-modal-adicionar'>
          <button className='btn btn-primary' onClick={() => setMostraModalInformacoes()}>Sair</button>
        </Modal.Footer>
      </Modal>
    )
  }

  function MsgInformativas(){
    if (showMsgInformativa){
      return(
        <div class="alert alert-success d-flex align-items-center" role="alert" 
          style={{width:"30rem", position:"fixed", left:"calc(100% - 66%)"}}
          onClick={() => setShowMsgInformativa(false)}
        >
          <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>  
          </svg>
          <div>
            {textoMsg}
            <div className="progress" style={{height:".2rem"}}>
              <div className="progress-bar bg-info" role="progressbar" style={{width:(100-progresso)+"%"}} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">
                
              </div>
            </div>
          </div>
        </div>
      )
    }else{
      return null
    }
  }

  return (
    <div className='principal'>

      <div className="container-fluid top-menu">
        <div className='col-4'>
          <button className='btn btn-success m-5' onClick={() => setMostraModalAddTarefa(true)}>Add. Tarefa</button>
          <button className='btn btn-primary' onClick={() => setMostraModalInformacoes(true)}>Informações</button>
        </div>
        <div className='col-4' style={{fontSize:"2rem", color:"white", fontWeight:"bold"}}>
          Trello simulator 
        </div>
        <div className='col-4'>
          
        </div>
      </div>

      <ModalNovaTarefa/>
      <ModalInformacoes/>
      <MsgInformativas/>

      <div className='container box-colunas'>
        <div className='col-3'>
          <div className='titulo-coluna'>aguardando</div>
          <div className='coluna-cards'>
            {dadosCardIniciar.length === 0 && (<div style={{color:"white"}}>Sem atividades</div>)}
            {dadosCardIniciar.map(itens => {
              return (<MontaCard id={itens.id} descricao={itens.descricao} titulo={itens.titulo} 
                       prioridade={itens.prioridade} nomeColuna={'aguardando'} data={itens.data}/> )
            })}
          </div>
        </div>
        <div className='col-3'>
          <div className='titulo-coluna'>desenvolvendo</div>
          <div className='coluna-cards'>
            {dadosCardDesenvolvimento.length === 0 && (<div style={{color:"white"}}>Sem atividades</div>)}
            {dadosCardDesenvolvimento.map(itens => {
              return (<MontaCard id={itens.id} descricao={itens.descricao} titulo={itens.titulo} 
                      prioridade={itens.prioridade} nomeColuna={'desenvolvendo'} data={itens.data}/> )
            })}
          </div>
        </div>
        <div className='col-3'>
          <div className='titulo-coluna'>teste</div>
          <div className='coluna-cards'>
            {dadosCardTeste.length === 0 && (<div style={{color:"white"}}>Sem atividades</div>)}
            {dadosCardTeste.map(itens => {
              return (<MontaCard id={itens.id} descricao={itens.descricao} titulo={itens.titulo} 
                     prioridade={itens.prioridade} nomeColuna={'teste'} data={itens.data}/> )
            })}
          </div>
        </div>
        <div className='col-3'>
          <div className='titulo-coluna'>finalizado</div>
          <div className='coluna-cards'>
            {dadosCardFinalizado.length === 0 && (<div style={{color:"white"}}>Sem atividades</div>)}
            {dadosCardFinalizado.map(itens => {
              return (<MontaCard id={itens.id} descricao={itens.descricao} titulo={itens.titulo} 
                      prioridade={itens.prioridade} nomeColuna={'finalizado'} data={itens.data}/> )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
