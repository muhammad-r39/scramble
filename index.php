<?php
require_once 'admin/config.php';
require_once 'admin/session.php';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Letterley | Word Game</title>
    <link rel="stylesheet" href="./styles.css" />
    <link rel="icon" href="assets/favicon.png" />
    <base href="./">
    <!-- Load AdSense script 
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1124471525205689"
     crossorigin="anonymous"></script>
     -->
  </head>
  <body>
    <main>
      <section id="header">
        <div class="container">
          <div class="headline">
            <h1>Letterley</h1>
            <p>Find today’s highest point word</p>
            <h3><span>Ly</span> = triple the points!</h3>
          </div>
        </div>
      </section>

      <section id="game">
        <div class="container">
          <div class="scores">
            <span class="player-score">0</span>
            <span class="progress-bar">
              <span class="progress"></span>
            </span>
            <span class="highest-score">0</span>
          </div>
          <div class="slot-wrapper word-assembly">
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
          </div>
          <div class="slot-wrapper letter-generator">
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
          </div>
          <div class="action">
            <button id="shuffle">SHUFFLE</button>
            <button id="hint">HINT</button>
          </div>
        </div>
      </section>

      <section id="gameScore" style="display: none">
        <div class="container">
          <div class="states-wrapper">
            <div class="states">
              <div class="played-count count-wrapper">
                <span class="count">36</span>
                <span class="count-type">Played</span>
              </div>
              <div class="win-count count-wrapper">
                <span class="count">92</span>
                <span class="count-type">Win %</span>
              </div>
              <div class="current-streak count-wrapper">
                <span class="count">4</span>
                <span class="count-type">Current Streak</span>
              </div>
              <div class="max-streak count-wrapper">
                <span class="count">64</span>
                <span class="count-type">Max Streak</span>
              </div>
            </div>
            <div class="hints-used">
              <p>Hints used to solve</p>
              <ul>
                <li>
                  <span class="hints-number">0</span>
                  <span class="hints-bar" hint-count="0" data-hints-used="0">
                    <span class="bar"></span>
                  </span>
                </li>
                <li>
                  <span class="hints-number">1</span>
                  <span class="hints-bar" hint-count="1" data-hints-used="0">
                    <span class="bar"></span>
                  </span>
                </li>
                <li>
                  <span class="hints-number">2</span>
                  <span class="hints-bar" hint-count="2" data-hints-used="0">
                    <span class="bar"></span>
                  </span>
                </li>
                <li>
                  <span class="hints-number">3</span>
                  <span class="hints-bar" hint-count="3" data-hints-used="0">
                    <span class="bar"></span>
                  </span>
                </li>
                <li>
                  <span class="hints-number">4</span>
                  <span class="hints-bar" hint-count="4" data-hints-used="0">
                    <span class="bar"></span>
                  </span>
                </li>
                <li>
                  <span class="hints-number">5</span>
                  <span class="hints-bar" hint-count="5" data-hints-used="0">
                    <span class="bar"></span>
                  </span>
                </li>
                <li>
                  <span class="hints-number">6</span>
                  <span class="hints-bar" hint-count="6" data-hints-used="0">
                    <span class="bar"></span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section class="add-space">
        <!-- Ad unit placeholder -->
        <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1124471525205689"
         data-ad-slot="6542816481"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
      </section>
    </main>
    <div class="modal" id="registerModal">
      <span class="close-modal"></span>
      <div class="container">
        <h2>Register To Save Your Score</h2>
        <form id="registrationForm">
          <div class="form-row">
            <div class="form-col">
              <label for="firstName">First name</label>
              <input type="text" id="firstName" placeholder="First Name" />
            </div>
            <div class="form-col">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" placeholder="Last Name" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <label for="emailAddress">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                placeholder="Email Address"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <label for="password">Password</label>
              <input type="password" id="password" placeholder="Password" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <label for="reEnterPassword">Re-enter Password</label>
              <input
                type="password"
                id="reEnterPassword"
                placeholder="Re-enter Password"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <input id="submit" type="submit" name="submit" value="REGISTER" />
            </div>
          </div>
        </form>
        <div class="login-link">
          Already have an account? <span class="btn-link btn-login">Login</span>
        </div>
      </div>
    </div>
    <div class="modal" id="loginModal">
      <span class="close-modal"></span>
      <div class="container">
        <h2>Login To Continue</h2>
        <form id="loginForm">
          <div class="form-row">
            <div class="form-col">
              <label for="loginEmail">Email Address</label>
              <input type="email" id="loginEmail" placeholder="Email Address" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <label for="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                placeholder="Password"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-col">
              <input
                id="loginSubmit"
                type="submit"
                name="submit"
                value="LOGIN"
              />
            </div>
          </div>
        </form>
        <div class="login-link">
          Don't have an account?
          <span class="btn-link btn-register">Register</span>
        </div>
      </div>
    </div>
    <div class="loading-screen">
      <p>Loading...</p>
    </div>
    <script src="./scripts/main.js"></script>
    <script src="./scripts/game.js"></script>
    <script src="./scripts/init.js"></script>
    <script src="./scripts/dragndrop.js"></script>
    <script src="./scripts/auth.js"></script>
    <script>
     // (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  </body>
</html>
