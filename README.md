# DAOhaus

A House for DAOs

## Development

1. Install dependencies

```bash
yarn install
```

2. Run a dev server

```bash
yarn start
```

### Linting

Set up auto-linting and prettier to be run on file save or in real-time in your IDE:
[VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

### Contributions

1. Clone or Fork this repo

2. Create your branch

   You will either pull of of the base branch: `develop` or a release branch if working on feature for a bundled release `RELEASE_<release name>`.

   Branch naming:

   `feature/<feature-name>`

   `fix/<bug name>`

   `chore/<chore name>`

3. Do your work and create the PR.

Please fetch the base or relase branch you pulled off of and ensure the latest work is merged into your branch before creating the PR.

PR template is TBD, so just be as descriptive as you can.

### Deployments

1. Deploy to staging

   PR from `develop` or the release branch, `RELEASE_<release name>` into `staging`. CD will deploy to

   `staging.pokemol.com` (kovan)

2. Deploy to production

   PR from `staging` into `production`. CD will deploy to

   `pokemol.com` (mainnet)
   `kovan.pokemol.com` (kovan)
   `rinkeby.pokemol.com` (rinkeby)
   `xdai.pokemol.com` (xdai)

   **Note that our CI/CD will fail if there are eslint code warnings.**


### License

DAOhaus is an easy user interface for decentralized autonomous organizations built on the Moloch DAO framework smart contracts <https://github.com/MolochVentures/moloch>. 

Copyright (C) 2021 DAOhaus

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.txt>.
