const {Command,flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const open = require('open');
const {cli} = require('cli-ux');

function promptemail(email, callback){
  readline.question(`have you finished confirming the email?`, (res) => {
    if(res === 'y' || res === 'Y' || res === 'yes'){
      SEF.ValidateSesEmail(email, function(err, data){
        if(err){
          console.error(err)
          cli.action.stop('Error')
        }
        else if(data){
          callback(true)
        }
        else {
          console.log("email hasnt been validated")
          promptemail(email, callback)
        }
      })
    }
    else if(res === "n" || res === "N" || res === "no"){
      SEF.VerifySesEmail(email, promptemail(email, callback))
    }
  })
}

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

function backend(cliaction, args, params, options){
  cliaction.start('Generating your lambda function')
  options['zip'] = true;
  options['store'] = true
  SEF.CreateLambdaFunction(args.name, options, function(err, data){
    if(err) {
      console.error(err.message)
      cliaction.stop('Error')
    }
    else {
      cliaction.stop()
      cliaction.start('Generating your cloudformation template')
      SEF.CreateTemplate(args.name, params, function(err, data){
        if(err) {
          console.error(err.message)
          cliaction.stop('Error')
        }
        else {
          cliaction.stop()
          cliaction.start('Creating your stack in the AWS cloud')
          SEF.CreateStack(args.name, data, function(err, data){
            if(err) {
              console.error(err)
              cliaction.stop()
            }
            else {
              cliaction.stop()
              cliaction.start('Fetching your API enpoint URL')
              SEF.GetApiUrl(args.name, data, function(err, res){
                if(err) {
                  console.error(err.message)
                  cliaction.stop('Error')
                }
                else {
                  cliaction.stop()
                  cliaction.start('Generating your form')
                  options["endpointUrl"] = res; 
                  SEF.CreateForm(args.name, options, function(err, data){
                    if(err) {
                      console.error(err.message)
                      cliaction.stop('Error')
                    }
                    else {
                      cliaction.stop()
                      open(`forms/${args.name}/${args.name}.html`);
                    }
                  })
                }
              })
            }
          })
        }
      }) 
    }
  })
}

class FullformCommand extends Command {
  async run() {
    const {args, flags} = this.parse(FullformCommand)
    let options = {email:null, formFields:null, recipients:null};
    let params = {};
    if(flags.email){
      options.email = flags.email;
    }
    if(flags.recipients){
      options.recipients = flags.recipients;
    }
    if(flags.message){
      options["emailMessage"] = flags.message;
    }
    if(flags.subject){
      options["emailSubject"] = flags.subject;
    }
    if(flags.captcha){
      options.captcha = true;
    }
    if(flags.fields){
      if(flags.labels){
        options.formFields = SEF.ParseFields(flags.fields, true);
      }
      else {
        options.formFields = SEF.ParseFields(flags.fields, false);
      }
    }
    Object.keys(options).map(function(key, index) {
      if(options[key]){
        params[key] = options[key]
      }
    })
    if(isEmpty(params)){
      options = null;
    }
    cli.action.start('Setting up')
    SEF.FormSetup(args.name, function(err, data){
      if(err){
        console.error(err)
      }
      else{
        cli.action.stop()
        cli.action.start('Verifying email')
        SEF.SesEmail(args.name, options, function(err, data){
          if(err) {
            console.error(err)
            cli.action.stop('Error')
          }
          else if(data){
            cli.action.stop()
            backend(cli.action, args, params, options)
          }
          else {
            console.log(`email confirmation has been sent to ${options.email}`)
            promptemail(options.email, function(err, data){
              if(err){
                console.error(err)
                cli.action.stop('Error')
              }
              else if(data){
                cli.action.stop()
                backend(cli.action, args, params, options)
              }
              else cli.action.stop('Error')
            })
          }
        })
      }
    })
  } 
}

FullformCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'name of the form - must be unique',
  },
]
FullformCommand.flags = {
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
    description: 'Adds recaptcha elements and scripts to the form and lambda function',
    multiple: false,
    required: false,
    default: false  
  }),
}

FullformCommand.description = `Generates an html form and saves it in the formNames folder`

module.exports = FullformCommand
