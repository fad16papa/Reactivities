using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public readonly  HttpStatusCode _code;
        public readonly object _errors;
        public RestException(HttpStatusCode code, object errors = null)
        {
            _errors = errors;
            _code = code;
        }
    }
}