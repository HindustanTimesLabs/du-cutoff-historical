# Historical cutoffs of Delhi University

This repo contains code and data used for a [visualisation on a decade of Delhi University cutoffs](https://github.com/HindustanTimesLabs/du-cutoff-historical.git).

The data is stored in `data/formatted_all_2017.csv`. It has the first cut off  for every course, in every college. Data has been excluded for courses that used to have entrance exams (such as English and Journalism).

The data has been sourced from the Delhi University website and Hindustan Times archives.

The visualisation was written in d3.

To run the code, you need node installed.

Clone the repo and run `npm install`.

`npm run dev` will compile the js and scss. `npm run build` will compile and minify the code for production.