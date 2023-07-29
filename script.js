import { Octokit, App } from "https://esm.sh/octokit";

const rootStyle = document.documentElement.style;
const buttonSearchSubmit = document.getElementById("username_search_btn");
const buttonModeSubmit = document.getElementById("app_header_color_button");
const modeIcon = document.getElementById("app_header_color_icon");
const inputSearchTextField = document.getElementById("github_username_search_input");
const githubUsernameText = document.getElementById("github_username");
const githubUsernameLinkText = document.getElementById("github_username_link");
const githubProfileIcon = document.getElementById("github_profile_icon");
const githubProfileBio = document.getElementById("github_user_bio")
const githubUserRepos = document.getElementById("github_user_repos");
const githubProfieUserJoinDate = document.getElementById("github_join_date");
const githubUserFollowers = document.getElementById("github_user_followers");
const githubUserFollowing = document.getElementById("github_user_following");
const githubProfileLocation = document.getElementById("github_user_location");
const githubProfileWebsite = document.getElementById("github_user_website");
const githubProfileTwitter = document.getElementById("github_user_twitter");
const githubProfileCompany = document.getElementById("github_user_company");
const githubErrorText = document.getElementById("app_error_text");

const octokit = new Octokit({});

let githubDarkMode = false;

buttonSearchSubmit.addEventListener("click", () => {
    updateProfile();
});

buttonModeSubmit.addEventListener("click", () => {
    if (githubDarkMode) {
        updateToLightMode();
    } else {
        updateToDarkMode();
    }
});

inputSearchTextField.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        updateProfile();
    }
});

function updateToLightMode() {
    rootStyle.setProperty("--github-social-link-colors-light", "#4B6A9B");
    rootStyle.setProperty("--github-username-link-color", "#0079FF");
    rootStyle.setProperty("--github-bio-color", "#4B6A9B");
    rootStyle.setProperty("--github-stats-background-color-light", "#F6F8FF");
    rootStyle.setProperty("--github-background-color-light", "#F6F8FF");
    rootStyle.setProperty("--github-container-background-color-light", "#FFFFFF");
    rootStyle.setProperty("--github-search-bar-background-color", "#60ABFF");
    rootStyle.setProperty("--github-social-links-text", "#4B6A9B");
    rootStyle.setProperty("--github-social-links-text-active", "#4B6A9B");
    rootStyle.setProperty("--github-username-search-button", "#0079FF");
    rootStyle.setProperty("--github-color", "black");
    rootStyle.setProperty("--github-username-link", "--github-social-links-text")
    buttonModeSubmit.style.color = "black";
    buttonModeSubmit.innerText = "DARK";
    modeIcon.src = "assets/icon-moon.svg";
    githubDarkMode = false;
}

function updateToDarkMode() {
    rootStyle.setProperty("--github-social-link-colors-light", "#4B6A9B");
    rootStyle.setProperty("--github-username-link-color", "#0079FF");
    rootStyle.setProperty("--github-bio-color", "#4B6A9B");
    rootStyle.setProperty("--github-stats-background-color-light", "#141D2F");
    rootStyle.setProperty("--github-background-color-light", "#141D2F");
    rootStyle.setProperty("--github-container-background-color-light", "#1E2A47");
    rootStyle.setProperty("--github-search-bar-background-color", "#60ABFF");
    rootStyle.setProperty("--github-social-links-text", "white");
    rootStyle.setProperty("--github-social-links-text-active", "#4B6A9B");
    rootStyle.setProperty("--github-username-search-button", "#0079FF");
    rootStyle.setProperty("--github-color", "white");
    rootStyle.setProperty("--github-username-link", "--github-social-links-text")
    buttonModeSubmit.innerText = "LIGHT";
    buttonModeSubmit.style.color = "white";
    modeIcon.src = "assets/icon-sun.svg";
    githubDarkMode = true;
}

async function updateProfile() {
    if (inputSearchTextField.value !== "") {
        try {
            const octokitResponse = await octokit.request("GET /users/{username}", {
                username: inputSearchTextField.value,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            // Don't display if success.
            githubErrorText.classList.add("display_none");

            // Set the src for the Github Profile Icon
            githubProfileIcon.src = octokitResponse.data['avatar_url'];

            // Set the Username text for Github
            githubUsernameText.textContent = octokitResponse.data['login'];

            // Set the link for the username on Github
            githubUsernameLinkText.textContent = "@" + octokitResponse.data['login'];
            githubUsernameLinkText.setAttribute("href", "https://github.com/" + octokitResponse.data['login']);

            // Set the join date for the user
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const joinDate = new Date(octokitResponse.data['created_at']);
            const joinMonth = months[joinDate.getMonth()];
            const joinDay = joinDate.getDay();
            const joinYear = joinDate.getFullYear();
            
            githubProfieUserJoinDate.textContent = `${joinMonth} ${joinDay}, ${joinYear}`;

            // Set the number of repositories
            githubUserRepos.textContent = octokitResponse.data['public_repos'];

            // Set the number of followers
            githubUserFollowers.textContent = octokitResponse.data['followers'];

            // Set the number of following
            githubUserFollowing.textContent = octokitResponse.data['following'];

            // Set the Biographical text
            const bioNullText = octokitResponse.data['login'] + " has no biography!";
            const bioNotNullText = octokitResponse.data['bio'];
            updateOctokitResponse(octokitResponse.data['bio'], githubProfileBio, bioNullText, bioNotNullText);

            // Set the Website text
            const locationNullText = "<p>Not Available</p>";
            const encodedLocation =  encodeURIComponent(octokitResponse.data['location']);
            const googleLocationQueryLink = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
            const locationNotNullText = `<a href="${googleLocationQueryLink}">${octokitResponse.data['location']}</a>`;
            updateOctokitResponse(octokitResponse.data['location'], githubProfileLocation, locationNullText, locationNotNullText);

            // Set the Website text
            const websiteNullText = "<p>Not Available</p>";
            const websiteNotNullText = `<a href="${octokitResponse.data['blog']}">${octokitResponse.data['blog']}</a>`;
            updateOctokitResponse(octokitResponse.data['blog'], githubProfileWebsite, websiteNullText, websiteNotNullText);

            // Set the Twitter text
            const twitterNullText = "Not Available";
            const twitterUsername = octokitResponse.data['twitter_username'];
            const twitterNotNullText = `<a href="https://twitter.com/${twitterUsername}">${twitterUsername}</a>`;
            updateOctokitResponse(twitterUsername, githubProfileTwitter, twitterNullText, twitterNotNullText);

            // Set the company text
            const companyNullText = "Not Available";
            const companyName = octokitResponse.data['company'];
            const companyNotNullText = `<a href="${companyName}">@${companyName}</a>`;
            updateOctokitResponse(octokitResponse.data['company'], githubProfileCompany, companyNullText, companyNotNullText);

        } catch (error) {
            githubErrorText.classList.remove("display_none");
            console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`);
        }

    }
}

function updateOctokitResponse(data, profileObj, nullText, notNullText) {
    if (data === null || data === '' || data == 'null') {
        profileObj.innerHTML = nullText;
    } else {
        profileObj.innerHTML = notNullText;
    }
}