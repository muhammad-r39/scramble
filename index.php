<?php
require_once 'admin/config.php';
require_once 'admin/session.php';
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SCRAMBLE | Word Game</title>
    <link rel="stylesheet" href="./styles.css" />
    <link rel="icon" href="assets/favicon.png" />
    <base href="./">
  </head>
  <body>
    <main>
      <section id="game">
        <div class="container">
          <div class="headline">
            <h1>SCRAMBLE</h1>
            <p>Find today’s highest point word</p>
          </div>
          <div class="scores">
            <span class="player-score">0</span>
            <span class="progress-bar">
              <span class="progress"></span>
            </span>
            <span class="highest-score">0</span>
          </div>
          <div class="word-assembly">
            <div class="slot" data-slot-id="1">
              <div class="slot-wrapper"></div>
            </div>
            <div class="slot" data-slot-id="2">
              <div class="slot-wrapper"></div>
            </div>
            <div class="slot" data-slot-id="3">
              <div class="slot-wrapper"></div>
            </div>
            <div class="slot" data-slot-id="4">
              <div class="slot-wrapper"></div>
            </div>
            <div class="slot" data-slot-id="5">
              <div class="slot-wrapper"></div>
            </div>
            <div class="slot" data-slot-id="6">
              <div class="slot-wrapper"></div>
            </div>
            <div class="slot" data-slot-id="7">
              <div class="slot-wrapper"></div>
            </div>
          </div>
          <div class="letter-generator">
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
            <button id="recall">RECALL</button>
          </div>
          <div class="timer">TIMER: <span class="time-count">00</span></div>
        </div>
      </section>
      <section class="add-space">Ad space</section>
      <section class="top-players">
        <div class="container">
          <h2>Today's Top 10</h2>
          <table id="topPlayers">
            <thead>
              <tr>
                <th class="position">No</th>
                <th class="name">Player Name</th>
                <th class="best-time">Best Time</th>
              </tr>
            </thead>
            <tbody>
              
            </tbody>
          </table>
          <?php if (!isset($_SESSION['user_id'])) { ?>
          <div class="cta">
            <span class="btn-join btn-login">Join Now</span>
          </div>
            <?php } ?>
          <div class="top-player-message">
            Be the first one to beat the high score.
          </div>
        </div>
        <?php if (isset($_SESSION['user_id'])) { ?>
          <span class="btn-logout">Logout</span>
        <?php } ?>
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
      <p>Loading</p>
    </div>
    <script src="./scripts/main.js"></script>
    <script src="./scripts/game.js"></script>
    <script src="./scripts/init.js"></script>
    <script src="./scripts/auth.js"></script>
  </body>
</html>
