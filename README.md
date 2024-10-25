# ClasseViva-API
This website lets you see your average grade by authenticating with your email and password used to access your Classeviva account.

This project is hosted on: [voti.silvestrin.ovh](https://voti.silvestrin.ovh)

This project is composed of two parts:
- Website
  - Provides an interface where the users can view their average grades in every subject and each period
- API Server
  - Its a proxy server used to access Classeviva's API, this was necessary to bypass CORS policy (its features will not be hosted publicly since it can provide only the token and grades of the user)

# Security
If you are concerned about security, here's some of the security measures that I took to avoid any data leaks:
- This website is protected by Cloudflare and this provides:
  - All the requests to the website go through Cloudflare for a safer experience
  - Only HTTPS traffic
  - Every request outside of Italy is denied
  - Requests inside Italy are filtered with anti-BOT prevention
- None of your credentials (email and password) are saved, the only things that are saved (inside and ONLY in YOUR browser) are:
  - token (expires after 1.5 hours from the creation)
  - token expire date
  - student ID
  - your grades

# Features
- Calculates the average grade of each subject
- Calculates the average grade of each period
- Calculates the average grade of the whole year

If you have any suggestions contact me on Whatsapp.

# The idea
The idea of building this tool started from my necessity of viewing my average grade at school because my school decided to disable it.
This project started because I feel like that viewing my average grade is like a motivation to do better at school so I decided to build this tool.
Yes, there are alternatives but they all require you to manually put in your grades and because I'm lazy I decided to make it automatic.

# Contributions
If you want to contribute to this project feel free to open a pull request or report an issue.

# Credits
- [Classeviva-Official-Endpoints](https://github.com/Lioydiano/Classeviva-Official-Endpoints)