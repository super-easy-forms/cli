const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

class LambdaCommand extends Command {
  async run() {
    const {args, flags} = this.parse(LambdaCommand)
    let options = {email:null, formFields:null, recipients:null};
    let params = {};
    if(flags.email){
      options.email = flags.email
    }
    if(flags.recipients){
      options.recipients = flags.recipients
    }
    if(flags.fields){
      options.fields = flags.feilds
    }
    Object.keys(options).map(function(key, index) {
      if(options[key]){
        params[key] = options[key]
      }
    })
    if(isEmpty(params)){
      options = null;
    }
    cli.action.start('Generating your lambda function')
    SEF.CreateLambdaFunction(args.name, options, function(err, data){
      if(err) console.error(err)
      else{
        cli.action.stop()
      }
    })
  } 
}

LambdaCommandargs = [
  {
    name: 'name',
    required: true,
    description: 'name of the form - must be unique',
  },
]
LambdaCommandflags = {
  email: flags.string({
    char: 'e',                    
    description: 'Email address that will be used to send emails',
    multiple: false,
    required: false         
  }), 
  recipients: flags.string({
    char: 'r',                    
    description: 'Recipients that will recieve emails on your behalf.',
    parse: input => input.split(","),
    multiple: false,
    required: false         
  }), 
  fields: flags.string({
    char: 'f',                    
    description: 'Desired form formFields',
    multiple: false,
    required: false         
  })
}

LambdaCommand.description = `Generates a lambda function and saves it as lambdaFunction.js in the formNames folder`

module.exports = LambdaCommand

