const {Command, flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');
const open = require('open');

class IamCommand extends Command {
  async run() {
    const {args, flags} = this.parse(IamCommand)
    let region = null;
    if(args.region){
      region = args.region
    }
    if(flags.create){
       SEF.CreateIamUser(args.user, region, function(err, data){
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else{
          open(data);
          cli.action.stop()
          console.log('Finish creating the IAM user and update the local profile in your machine')
        }
      })
    }
  } 
}

IamCommand.args = [
  {
    name: 'user',
    required: true,
    description: 'name of the IAM user',
  },
  {
    name: 'region',
    required: false,
    description: 'your desired AWS region.',
  },
]
IamCommand.flags = {
  create: flags.boolean({
    char: 'c',
    default: true,
    description: 'Helps you create an IAM user and adds its profile to the .env file',
  }),
}

IamCommand.description = `the --create flag will open up a window with the AWS console so that you confirm the creation of a user with the entered name.`

module.exports = IamCommand
