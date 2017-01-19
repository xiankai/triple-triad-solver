import React from 'react';

import {
  PageHeader,
  Title,
  View,

  Panel,
  PanelHeader,
} from '../app/components';

const link = link => <a href={link}>{link}</a>;

const StackPage = () => (
  <View>
    <Title message="Tech stack" />
    <PageHeader
      description="What this site was built with"
      heading="Tech stack"
    />
    <Panel theme="primary">
      <PanelHeader>
        Frontend framework
      </PanelHeader>
      <dl>
        <dt>Este</dt>
        <dd>{ link('https://github.com/este/este') }</dd>
        <dd>
          Very useful as a starter template, as it offers a lot of smart defaults out of the box.
          I also ended up using the UI framework bundled with it, as well as its hosting options.
          It even helped me to get started with Webpack, when I was previously using JSPM for company projects.
        </dd>
      </dl>
      <dl>
        <dt>RxJS / Redux-observable</dt>
        <dd>{ link('reactivex.io/rxjs/manual/index.html') }</dd>
        <dd>{ link('https://redux-observable.js.org/') }</dd>
        <dd>
          Rx is very useful for dealing with network code in a logical fashion,
          and this project helped bootstrap my learning journey in it.
        </dd>
      </dl>
      <dl>
        <dt>PeerJS Client/Server</dt>
        <dd>{ link('http://peerjs.com') }</dd>
        <dd>{ link('https://github.com/atskimura/peerjs-server-heroku') }</dd>
        <dd>
          To host multiplayer via WebRTC.
          Unfortunately it still needs a connection broker,
          and PeerJS's hosted server doesn't support HTTPS/SSL,
          so I had to mount it on Heroku.
          @atsikmura's project example was instrumental in getting it auto-deployed to Heroku seamlessly.
        </dd>
      </dl>
    </Panel>

    <Panel theme="primary">
      <PanelHeader>
        Triple Triad Solver logic
      </PanelHeader>
      <dl>
        <dt>Initial idea - Complete probability/decision tree</dt>
        <dd>Came to the realization the computing power required was infeasible - requiring better algorithms.</dd>
      </dl>
      <dl>
        <dt>Algorithms - Game Theory, Depth/Breadth Search</dt>
        <dd>{ link('https://www.researchgate.net/publication/238759973_Search_Methods_used_in_the_Turn-Based_Two-Player_Card_Game_Triple_Triad' ) }</dd>
        <dd>
          In part inspired by an obscure thesis written about this very game,
          with which the author kindly acceded to my request for a copy of his original article.
        </dd>
      </dl>
      <dl>
        <dt>Search weights</dt>
        <dd>Still a work in progress</dd>
      </dl>
      <dl>
        <dt>Machine Learning</dt>
        <dd>
          Feed it many games especially from multiplayer, see if it can suggest better stat weights.
          Use Firebase DB to store data.
        </dd>
      </dl>
    </Panel>

    <Panel theme="primary">
      <PanelHeader>
        Assets
      </PanelHeader>
      <dl>
        <dt>Color and Font to replicate that used in game</dt>
        <dd>Thanks roii.</dd>
      </dl>
    </Panel>
  </View>
);

export default StackPage;
