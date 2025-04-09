import logo from './logo.svg';
import './App.css';
import ChatBot from './ChatBot';
import Transcribe from './Transcribe';
import ScheduleMeet from './ScheduleMeet';

function App() {
  return (
    <div style={{border:'1px solid black', margin:'auto', marginTop:'150px', padding:'50px'}} className="App">
      {/* <ChatBot/> */}
      {/* <Transcribe/> */}
      <ScheduleMeet/>
    </div>
  );
}

export default App;
