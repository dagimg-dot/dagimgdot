---
title: "BDU Sims API"
description: "Exposes students information from the BDU SIMS Website"
date: "Apr 27 2023"
repoURL: "https://github.com/dagimg-dot/bdu-sims-api"
builtWith: "NodeJS (Express)"
images: ["https://i.postimg.cc/mktsmp65/Screenshot-from-2024-08-09-20-07-51.png"]
---

This is Unofficial API for Bahir Dar University Student Information Management System built using JavaScript.

## Disclaimer

This API is not officially supported by BDU. It is only for educational purpose.

To use this API, you need to have a valid SIMS login credentials. Which means you need to be a student of Bahir Dar University. If you are not a student and want to use this API to develop your own application for BDU students that's cool too. You should do it 😄😄.

## Usage

### Available Endpoints

| Endpoint                           | Method | Description                                                                    | Auth Required | Response                                    |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------ | ------------- | ------------------------------------------- |
| /api/login                         | POST   | Login to SIMS                                                                  | No            | Token, Your Name and Success message        |
| /api/logout                        | GET    | Logout                                                                         | Yes           | Success message                             |
| /api/status/general                | GET    | Get general grade info for all semesters that the student learned              | Yes           | See [General Status](#general-status)       |
| /api/status/detail/:year/:semester | GET    | Get grade info about a specific semester with all the courses the student took | Yes           | See [Detail Satus](#detail-status)          |
| /api/remaining-courses             | GET    | Get remaining courses that the student will take in the coming semesters       | Yes           | See [Remaining Courses](#remaining-courses) |
