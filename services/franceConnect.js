import axios from 'axios';
import config from '../config/config';

const checkAccessToken = async (req, res, next) => {
    // TODO make this test  https://github.com/tkellen/js-express-bearer-token/blob/master/index.js#L23
    const accessToken = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!accessToken) {
        return res.sendStatus(400);
    }

    let user;

    try {
        user = await axios({
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: {"token": accessToken},
            url: config.checkTokenURL,
        })
    } catch (error) {
        throw error;
    }

    res.user = user;

    return next();
}

export default checkAccessToken;
