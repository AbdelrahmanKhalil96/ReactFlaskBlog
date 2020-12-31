import React from 'react';
import { Link } from 'react-router-dom';

const Chatbot = () => {
    return (
        <div>
            <button id="rate" style={{ display: 'none' }} data-toggle='modal' data-target='#exampleModal'></button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" data-backdrop="static" data-keyboard="false" role="dialog"
                aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">

                        </div>
                        <input type="hidden" id="hInput" name="hInput" value="user,bot,1"></input>

                        <div className="modal-body">
                            <div className="container" id="rate" style={{ marginLeft: '10%' }}>
                                <h5 id="ple">please evaluate the answer:</h5>
                                <h5 id="th">Thank You!</h5>

                                <div className='starrr' id='star1'></div>
                                <div>&nbsp;
                        <span className='your-choice-was' style={{ display: 'none' }}>
                                        Your rating was <span className='choice'></span>.
                        </span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" id="clmodal" style={{ display: 'none' }}>Close</button>
                            <button type="button" className="btn btn-primary" id="saveEditReq" onClick="sendEdit()">Save chat With
                    Rating</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <hr></hr>
                <h1 style={{ textAlign: 'center' }}>ChatBot</h1>
                <div className="row">
                    <div className="chatbox chatbox22 chatbox--tray">
                        <div className="chatbox__title">
                            <h5><Link to="#" onClick={e => e.preventDefault()}>Leave a message</Link>
                            </h5>
                        </div>
                        <div className="chatbox__body" id="chat_body">
                            <div className="chatbox__body__message chatbox__body__message--left">

                                <img src="https://www.gstatic.com/webp/gallery/2.jpg" alt='IMG'></img>
                                <div className="clearfix"></div>
                                <div className="ul_section_full">
                                    <ul className="ul_msg">
                                        <li><strong>Bot</strong></li>
                                        <li>Welcome to my chatbot</li>
                                    </ul>
                                    <div className="clearfix"></div>

                                </div>

                            </div>

                        </div>
                        <div className="panel-footer">
                            <div className="input-group">
                                <input id="btn-input" type="text" className="form-control input-sm chat_set_height"
                                    placeholder="Type your message here..." tabIndex="0" dir="ltr" spellCheck="false"
                                    autoComplete="off" autoCorrect="off" autoCapitalize="off" contentEditable="true" />

                                <span className="input-group-btn">
                                    <button className="btn bt_bg btn-sm" id="btn-chat">
                                        Send</button>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <p>This Is Chatbot Section</p>
        </div>
    )
}
export default Chatbot;