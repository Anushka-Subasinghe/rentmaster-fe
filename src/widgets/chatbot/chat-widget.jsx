import React, { useState, useEffect } from 'react';
import {Widget, addResponseMessage, addLinkSnippet, addUserMessage, setQuickButtons} from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

// const buttons = [{label: 'first', value: '1'}, {label: 'second', value: '2'}];

const ChatWidget = () => {

  useEffect(() => {
    addResponseMessage('Welcome to this awesome chat!');
  },[]);

  handleNewUserMessage = newMessage => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
  };

  // handleQuickButtonClicked = data => {
  //   console.log(data);
  //   setQuickButtons(buttons.filter(button => button.value !== data));
  // };
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          handleQuickButtonClicked={this.handleQuickButtonClicked}
          // profileAvatar={'text'}
          title="Polls"
          subtitle="Polls Demo"
        />
      </div>
    );
}

export default ChatWidget;