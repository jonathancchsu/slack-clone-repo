import './NavBar.css';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { searchInWorkspace } from '../../store/workspace';
import { postDmRoom } from '../../store/dmRooms';
import ReactHtmlParser from "react-html-parser";

function SearchBox({ setShowSearchBox }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [parameters, setParameters] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState([]);
    const user = useSelector(state => state.session.user);
    const workspace = useSelector(state => state.workspace.currentWorkspace);

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(searchInWorkspace({ workspace_id: workspace.id, parameters: parameters.join(), keyword: searchInput })).then((result) => {
            console.log(result);
            setResults(result.result);
        })
    }

    return (
        <div id='search-box' style={{ height: results.length ? '500px' : 'fit-content' }}>
                <div id='search-header'>
                    <i className="fas fa-search"></i>
                    <form onSubmit={handleSubmit}>
                        <input placeholder='Search' type='text' value={searchInput} onChange={e => setSearchInput(e.target.value)}></input>
                    </form>
                    { searchInput.length ? <p onClick={() => setSearchInput("")}>Clear</p> : null }
                    <button onClick={e => {
                        e.preventDefault();
                        setShowSearchBox(false);
                    }}><i className="fas fa-times"></i></button>
                </div>
                { results.length ? <div id='results'>
                    {
                        results.map((result, idx) => {
                            return (
                                <div className='result-box' key={idx}>
                                    {result.username && <div className='result-user' onClick={() => {
                                        dispatch(postDmRoom({ owner_id: user.id, workspace_id: workspace.id, members: [{ id: user.id }, { id: result.id }] })).then(dmRoom => {
                                            history.push(`/workspaces/${workspace.id}/messages/dm_rooms/${dmRoom}`);
                                            setShowSearchBox(false);
                                        })
                                    }}><i className="far fa-user"></i><img src={result.profile_picture} alt=''></img><p>{result.username}</p></div>}
                                    {result.content &&
                                        <div className='result-message'>
                                            <i className="far fa-comment-dots"></i>
                                            <img src={result.sender_profile_picture} alt=''></img>
                                            <div>
                                                <strong>{result.sender_username}</strong>
                                                <p>{ReactHtmlParser(result.content)}</p>
                                            </div>
                                        </div>}
                                    {result.name && <div onClick={() => {
                                        history.push(`/workspaces/${workspace.id}/messages/channels/${result.id}`);
                                        setShowSearchBox(false);
                                    }} className='result-channel'><i className="fas fa-chalkboard-teacher"></i> <p>{result.name}</p></div>}
                                </div>
                            )})
                    }
                </div> : null }
                <div id='looking-for'>
                    <p>I'm looking for...</p>
                    <div id='parameters'>
                        <button
                            className={parameters.includes('messages').toString()}
                            onClick={e => {
                                e.preventDefault();
                                parameters.includes('messages') ? setParameters(parameters.filter(parameter => parameter !== 'messages'))
                                    :
                                setParameters([...parameters, 'messages'])
                            }}><i className="far fa-comments"></i> Messages</button>
                        <button
                            className={parameters.includes('channels').toString()}
                            onClick={e => {
                                e.preventDefault();
                                parameters.includes('channels') ? setParameters(parameters.filter(parameter => parameter !== 'channels'))
                                    :
                                setParameters([...parameters, 'channels'])
                            }}><i className="far fa-list-alt"></i> Channels</button>
                        <button
                            className={parameters.includes('people').toString()}
                            onClick={e => {
                                e.preventDefault();
                                parameters.includes('people') ? setParameters(parameters.filter(parameter => parameter !== 'people'))
                                    :
                                setParameters([...parameters, 'people'])
                            }}><i className="fas fa-users"></i> People</button>
                    </div>
                </div>
        </div>
    );
}

export default SearchBox;
