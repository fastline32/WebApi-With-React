using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence.Data;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _db;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext db, IUserAccessor userAccessor)
            {
                _db = db;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                 AppUser observer = await _db.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

                 AppUser target = await _db.Users.FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);

                 if(target == null) return null;

                 UserFollowing following = await _db.UserFollowings.FindAsync(observer.Id, target.Id);

                 if(following == null)
                 {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    _db.UserFollowings.Add(following);
                 }
                 else
                 {
                    _db.UserFollowings.Remove(following);
                 }

                 bool success = await _db.SaveChangesAsync() > 0;

                 if(success) return Result<Unit>.Success(Unit.Value);

                 return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}