using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Infrastructure.Configuration;
using Vsb.UrgentApp.Tasks.Login;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.API.Controllers
{
    public class UserController : ApiController
    {
        private readonly IUserTasks _userTasks;
        private readonly IWebApiConfiguration _configuration;

        public UserController(
            IUserTasks userTasks,
            IWebApiConfiguration configuration)
        {
            this._userTasks = Requires.IsNotNull(userTasks, nameof(userTasks));
            this._configuration = Requires.IsNotNull(configuration, nameof(configuration));
        }

        [Authorize]
        [HttpGet]
        public HttpResponseMessage Get()
        {
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        public IHttpActionResult Authenticate(UserDto userDto)
        {
            var loginResponse = new LoginResponseDto();
            LoginRequestDto loginrequest = new LoginRequestDto();
            loginrequest.Username = userDto.Name.ToLower();
            loginrequest.Password = userDto.Password;

            var authenticatedUserDto = _userTasks.Authenticate(userDto);

            bool isUsernamePasswordValid = authenticatedUserDto != null;

            // if credentials are valid
            if (isUsernamePasswordValid)
            {
                string token = CreateToken(loginrequest.Username);
                //return the token
                return Ok<string>(token);
            }
            else
            {
                // if credentials are not valid send unauthorized status code in response
                loginResponse.ResponseMsg.StatusCode = HttpStatusCode.Unauthorized;
                IHttpActionResult response = ResponseMessage(loginResponse.ResponseMsg);
                return response;
            }
        }

        private string CreateToken(string username)
        {
            //Set issued at date
            DateTime issuedAt = DateTime.UtcNow;
            //set the time when it expires
            DateTime expires = DateTime.UtcNow.AddDays(1);

            //http://stackoverflow.com/questions/18223868/how-to-encrypt-jwt-security-token
            var tokenHandler = new JwtSecurityTokenHandler();

            //create a identity and add claims to the user which we want to log in
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, username)
            });

            string sec = _configuration.SecureKey;
            
            var securityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.Default.GetBytes(sec));
            var signingCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
                securityKey, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256Signature);

            //create the jwt
            var token =
                (JwtSecurityToken)
                    tokenHandler.CreateJwtSecurityToken(issuer: "http://localhost:1467", audience: "http://localhost:1467",
                        subject: claimsIdentity, notBefore: issuedAt, expires: expires, signingCredentials: signingCredentials);
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }
    }
}