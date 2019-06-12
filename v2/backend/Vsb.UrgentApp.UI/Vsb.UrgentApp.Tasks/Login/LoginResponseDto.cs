using System.Net.Http;

namespace Vsb.UrgentApp.Tasks.Login
{
    public class LoginResponseDto
    {
        public LoginResponseDto()
        {

            this.Token = "";
            this.ResponseMsg = new HttpResponseMessage() { StatusCode = System.Net.HttpStatusCode.Unauthorized };
        }

        public string Token { get; set; }
        public HttpResponseMessage ResponseMsg { get; set; }
    }
}
