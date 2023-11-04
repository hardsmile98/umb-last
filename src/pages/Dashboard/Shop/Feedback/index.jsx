import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import FeedbackChats from './Chats';

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { props } = this;

    return (
      <div className="row margin-15">
        <div className="col-lg-12">
          <div className="">
            <Switch>
              <Route path={`${props.match.path}/chats`} component={FeedbackChats} />

              <Route render={() => <Redirect to={`/dashboard/shops/${props.match.params.shopId}/feedback/chats`} />} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Feedback;
