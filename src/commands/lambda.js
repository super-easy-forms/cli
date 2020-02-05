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
      options.fields = flags.fields
    }
    if(flags.message){
      options.message = flags.message
    }
    if(flags.subject){
      options.subject = flags.subject
    }
    if(flags.captcha){
      options.captcha = true;
    }
    if(flags.zip){
      options.zip = true;
    }
    if(flags.bucket){
      options.bucket = true;
    }
    Object.keys(options).map(function(key, index) {
      if(options[key]){
        params[key] = options[key]
      }
    })
    if(isEmpty(params)){
      options = null;
    }
    if(args.action === 'create'){
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
    else if(args.action === 'update'){
      SEF.UpdateLambdaFunction(args.name, function(err, data){
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
}

LambdaCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'name of the form - must be unique',
  },
  {
    name: 'action',
    required: false,
    description: 'action to perform to the lambda function - create or update',
    default: 'create',
    options: ['create', 'update']
  }
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
  message: flags.string({
    char: 'm',                    
    description: 'the email message body. you can use html and you can use <FormOutput> to include the information from the form submission',
    multiple: false,
    required: false         
  }),  
  subject: flags.boolean({
    char: 's',
    default: true,
    description: 'the subject of the email message',
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
    default: false  
  }),
  bucket: flags.boolean({
    char: 'b',                    
    description: 'creates a new s3 bucket and uploads the zipped lambda function',
    multiple: false,
    required: false,
    default: false,
    dependsOn: ["zip"]  
  })
}

LambdaCommand.description = `Creates or updates a lambda function and optionally zips and uploads it into an AWS s3 bucket.`

module.exports = LambdaCommand

