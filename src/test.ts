import * as serverActions from './lib/serverActions'

async function init() {
  try {
    const response = await serverActions.loadAccountStakes('imjohnatboid')
    console.log(response);

  } catch (error) {
    console.error(error);
  }
}
init()
