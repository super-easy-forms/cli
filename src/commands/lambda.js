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
    if(flags.captcha){
      options.captcha = true;
    }
    if(flags.zip){
      options.zip = true;
    }
    if(flags.store){
      options.store = true;
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
      if(err) {
        console.error(err)
        cli.action.stop('Error')
      }
      else{
        cli.action.stop()
      }
    })
  } 
}

LambdaCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'name of the form - must be unique',
  },
]
LambdaCommand.flags = {
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
  }),
  captcha: flags.boolean({
    char: 'c',                    
    description: 'Adds recaptcha elements to the lambda function',
    multiple: false,
    required: false,
  }),
  zip: flags.boolean({
    char: 'z',                    
    description: 'zips the lambda function',
    multiple: false,
    required: false,
    default: true  
  }),
  store: flags.boolean({
    char: 's',                    
    description: 'creates a new s3 bucket and uploads the zipped lambda function',
    multiple: false,
    required: false,
    default: true,
    dependsOn: ["zip"]  
  })
}

LambdaCommand.description = `Generates a lambda function and saves it as lambdaFunction.js in the formNames folder`

module.exports = LambdaCommand

