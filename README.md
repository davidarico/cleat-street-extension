# Not Cleat Street Extension

Nothing in this repo is best practice and creating a chrome extension is incredibly hacky

Nonetheless hope this is useful for traders

## Feature list
- [X] Remember what books have been selected between refreshes
- [X] Highlighting rows of bets already met
- [X] Ability to mark stale bets
- [ ] Add colorblind mode
- [ ] Add help bubble on the page to explain commands
- [ ] Dark mode
- [ ] Add support for marking parlays
- [X] Auto refresh ability and highlight new bets

## How to install
Recommended to use git if you have it. This way you can refresh using git commands (more info below)
[Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

#### If using git
1. Open Command line (windows key then type in "cmd", press enter)
    If using the non-native install git bash type "bash" instead
2. `cd` (change directory) in the command line to desired folder

    `cd %HOMEPATH%/Documents` might be a good place if using Windows Command Line

    `cd ~/Documents` if using git bash (**recommended**)
3. Run `git clone https://github.com/davidarico/cleat-street-extension.git` to get the repo

#### If **not** using git
1. Click on the green button "Code"
2. Click "Download ZIP"
3. Unpack ZIP file

#### Installing
1. Open Chrome Extensions
2. Toggle Developer Mode in the top right corner
3. Click "Load Unpacked"
4. Open the folder where the extension is saved
5. Should be loaded and if the cleatstreet app is open refresh it

## Updating via git
1. Open your perfered command line once again
2. `cd` into your repo (the folder)

    `cd %HOMEPATH%/Documents/cleat-street-extension` if using windows command line and destination is one used above

    `cd ~/Documents/cleat-street-extension` if using git bash
3. Run `git fetch` then `git rebase`
4. Go into the manage chrome extensions page
5. Click the refresh icon in the cleat street extension
