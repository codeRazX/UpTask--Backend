import {app} from "./server"
import colors from 'colors'


const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log( colors.cyan.bold('Server running on PORT: ' +  PORT)))

