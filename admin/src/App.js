import './App.scss';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Login, Dash} from './pages';

const App = () => {
    return (
        <div className='App'>
            <BrowserRouter>
                <Routes>
                    <Route path='*' element={<Login/>}/>
                    <Route path='Dash' element={<Dash/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
