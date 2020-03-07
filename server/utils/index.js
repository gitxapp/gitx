import axios from 'axios';

const getRepoOwnerType = async (name) => {

    if (!name) throw Error('Invalid argument')

    try {
        let result = await axios.get(`${process.env.GITHUB_API_URL}orgs/${name}`);
        if(result.id) return 'organization'
        return 'user'
    } catch (e) {
        throw Error('Internal error')
    }
}

export { getRepoOwnerType };